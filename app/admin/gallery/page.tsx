"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowLeft, ArrowUp, Edit, ImagePlus, Plus, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import {
  Album,
  AlbumImage,
  MediaCenterItem,
  MediaCenterItemType,
  galleryImageUrl,
  isStoragePath,
  mediaCenterUrl,
} from "@/lib/supabase/cms"

function safeFileName(file: File) {
  return file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")
}

export default function AdminGalleryPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const [mediaItems, setMediaItems] = useState<MediaCenterItem[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState("")
  const [title, setTitle] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [mediaType, setMediaType] = useState<MediaCenterItemType>("video")
  const [mediaTitle, setMediaTitle] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaPages, setMediaPages] = useState(0)
  const [mediaOrder, setMediaOrder] = useState(0)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaThumbFile, setMediaThumbFile] = useState<File | null>(null)
  const [editingMedia, setEditingMedia] = useState<MediaCenterItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) ?? albums[0]

  const fetchAlbums = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("albums")
      .select("id, title, cover_image, created_at, album_images(id, album_id, image_url, order_index, created_at)")
      .order("created_at", { ascending: false })

    if (error) {
      setMessage(error.message)
      setAlbums([])
      return
    }

    const mapped = ((data as Album[]) ?? []).map((album) => ({
      ...album,
      album_images: [...(album.album_images ?? [])].sort((a, b) => a.order_index - b.order_index),
    }))
    setAlbums(mapped)
    setSelectedAlbumId((current) => current || mapped[0]?.id || "")
  }, [])

  const fetchMediaItems = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("media_center_items")
      .select("id, type, title, media_url, thumbnail_url, pages, order_index, created_at")
      .order("type", { ascending: true })
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      setMessage(error.message)
      setMediaItems([])
      return
    }

    const rows = ((data as MediaCenterItem[]) ?? [])
    setMediaItems(rows)
    setMediaOrder(rows.length ? Math.max(...rows.map((row) => row.order_index)) + 1 : 0)
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (cancelled) return
      if (profile?.role !== "admin" && profile?.role !== "super_admin") {
        router.push("/admin/login")
        return
      }

      setRole(profile.role)
      await fetchAlbums()
      await fetchMediaItems()
      setLoading(false)
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [fetchAlbums, fetchMediaItems, router])

  const uploadGalleryFile = async (albumId: string, selected: File, prefix = "image") => {
    const supabase = createClient()
    const objectPath = `${albumId}/${prefix}-${Date.now()}-${safeFileName(selected)}`
    const { error } = await supabase.storage
      .from("gallery-images")
      .upload(objectPath, selected, {
        contentType: selected.type,
        upsert: false,
      })

    if (error) throw error
    return objectPath
  }

  const uploadMediaCenterFile = async (itemId: string, selected: File, prefix = "media") => {
    const supabase = createClient()
    const objectPath = `${itemId}/${prefix}-${Date.now()}-${safeFileName(selected)}`
    const { error } = await supabase.storage
      .from("media-center")
      .upload(objectPath, selected, {
        contentType: selected.type,
        upsert: false,
      })

    if (error) throw error
    return objectPath
  }

  const createAlbum = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("albums")
        .insert({ title: title.trim(), cover_image: null })
        .select("id")
        .single()
      if (error) throw error

      let coverPath: string | null = null
      if (coverFile) {
        coverPath = await uploadGalleryFile(data.id, coverFile, "cover")
        const { error: coverError } = await supabase
          .from("albums")
          .update({ cover_image: coverPath })
          .eq("id", data.id)
        if (coverError) throw coverError
      }

      setTitle("")
      setCoverFile(null)
      setSelectedAlbumId(data.id)
      await fetchAlbums()
      setMessage("Album created.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create album.")
    } finally {
      setSaving(false)
    }
  }

  const uploadImages = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedAlbum || !imageFiles?.length) return
    setSaving(true)
    setMessage("")

    try {
      const supabase = createClient()
      const currentMax = selectedAlbum.album_images?.length
        ? Math.max(...selectedAlbum.album_images.map((image) => image.order_index))
        : -1
      const insertedPaths: string[] = []

      for (let index = 0; index < imageFiles.length; index += 1) {
        const selected = imageFiles[index]
        const imagePath = await uploadGalleryFile(selectedAlbum.id, selected)
        insertedPaths.push(imagePath)
        const { error } = await supabase.from("album_images").insert({
          album_id: selectedAlbum.id,
          image_url: imagePath,
          order_index: currentMax + index + 1,
        })
        if (error) throw error
      }

      if (!selectedAlbum.cover_image && insertedPaths[0]) {
        await supabase.from("albums").update({ cover_image: insertedPaths[0] }).eq("id", selectedAlbum.id)
      }

      setImageFiles(null)
      await fetchAlbums()
      setMessage("Images uploaded.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload images.")
    } finally {
      setSaving(false)
    }
  }

  const deleteImage = async (image: AlbumImage) => {
    if (!confirm("Delete this image?")) return
    const supabase = createClient()
    const { error } = await supabase.from("album_images").delete().eq("id", image.id)
    if (error) {
      setMessage(error.message)
      return
    }
    if (isStoragePath(image.image_url)) {
      await supabase.storage.from("gallery-images").remove([image.image_url])
    }
    await fetchAlbums()
  }

  const deleteAlbum = async (album: Album) => {
    if (!confirm(`Delete album "${album.title}" and all images?`)) return
    const paths = [
      album.cover_image,
      ...(album.album_images ?? []).map((image) => image.image_url),
    ].filter(isStoragePath) as string[]

    const supabase = createClient()
    const { error } = await supabase.from("albums").delete().eq("id", album.id)
    if (error) {
      setMessage(error.message)
      return
    }
    if (paths.length) {
      await supabase.storage.from("gallery-images").remove([...new Set(paths)])
    }
    setSelectedAlbumId("")
    await fetchAlbums()
  }

  const moveImage = async (index: number, direction: -1 | 1) => {
    if (!selectedAlbum?.album_images) return
    const target = selectedAlbum.album_images[index]
    const other = selectedAlbum.album_images[index + direction]
    if (!target || !other) return

    const supabase = createClient()
    const { error: firstError } = await supabase
      .from("album_images")
      .update({ order_index: other.order_index })
      .eq("id", target.id)
    const { error: secondError } = await supabase
      .from("album_images")
      .update({ order_index: target.order_index })
      .eq("id", other.id)

    if (firstError || secondError) {
      setMessage(firstError?.message ?? secondError?.message ?? "Could not reorder images.")
      return
    }
    await fetchAlbums()
  }

  const setCover = async (album: Album, image: AlbumImage) => {
    const supabase = createClient()
    const { error } = await supabase.from("albums").update({ cover_image: image.image_url }).eq("id", album.id)
    if (error) {
      setMessage(error.message)
      return
    }
    await fetchAlbums()
  }

  const resetMediaForm = () => {
    setEditingMedia(null)
    setMediaType("video")
    setMediaTitle("")
    setMediaUrl("")
    setMediaPages(0)
    setMediaFile(null)
    setMediaThumbFile(null)
    setMediaOrder(mediaItems.length ? Math.max(...mediaItems.map((item) => item.order_index)) + 1 : 0)
  }

  const startEditMedia = (item: MediaCenterItem) => {
    setEditingMedia(item)
    setMediaType(item.type)
    setMediaTitle(item.title)
    setMediaUrl(item.type === "video" ? item.media_url : "")
    setMediaPages(item.pages ?? 0)
    setMediaOrder(item.order_index)
    setMediaFile(null)
    setMediaThumbFile(null)
  }

  const saveMediaItem = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const supabase = createClient()
      const id = editingMedia?.id ?? crypto.randomUUID()
      let nextMediaUrl = editingMedia?.media_url ?? ""
      let nextThumbUrl = editingMedia?.thumbnail_url ?? null

      if (mediaType === "video") {
        nextMediaUrl = mediaUrl.trim()
        if (!nextMediaUrl) throw new Error("YouTube link is required.")
      } else if (mediaFile) {
        nextMediaUrl = await uploadMediaCenterFile(id, mediaFile, mediaType)
      } else if (!editingMedia) {
        throw new Error(mediaType === "photo" ? "Photo file is required." : "Magazine file is required.")
      }

      if (mediaThumbFile) {
        nextThumbUrl = await uploadMediaCenterFile(id, mediaThumbFile, "thumb")
      }

      const payload = {
        id,
        type: mediaType,
        title: mediaTitle.trim(),
        media_url: nextMediaUrl,
        thumbnail_url: nextThumbUrl,
        pages: mediaType === "magazine" ? Number(mediaPages) || 0 : null,
        order_index: Number(mediaOrder) || 0,
      }

      const { error } = editingMedia
        ? await supabase.from("media_center_items").update(payload).eq("id", editingMedia.id)
        : await supabase.from("media_center_items").insert(payload)
      if (error) throw error

      resetMediaForm()
      await fetchMediaItems()
      setMessage("Media Center item saved.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save Media Center item.")
    } finally {
      setSaving(false)
    }
  }

  const deleteMediaItem = async (item: MediaCenterItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return
    const supabase = createClient()
    const { error } = await supabase.from("media_center_items").delete().eq("id", item.id)
    if (error) {
      setMessage(error.message)
      return
    }

    const paths = [item.media_url, item.thumbnail_url].filter(isStoragePath) as string[]
    if (paths.length) {
      await supabase.storage.from("media-center").remove(paths)
    }
    await fetchMediaItems()
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        <div>
          <Button asChild variant="ghost" className="mb-2">
            <Link href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Gallery Albums</h1>
          <p className="text-gray-600">Signed in as {role === "super_admin" ? "Super admin" : "Admin"}</p>
        </div>

        {message && <div className="rounded-md border bg-white p-3 text-sm text-gray-700">{message}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Create album</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createAlbum} className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="album-title">Album title</Label>
                <Input id="album-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="cover">Cover image</Label>
                <Input id="cover" type="file" accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)} />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Create album"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Albums</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {albums.map((album) => (
                <button
                  type="button"
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${
                    selectedAlbum?.id === album.id ? "border-blue-600 bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
                    {album.cover_image && (
                      <img src={galleryImageUrl(album.cover_image)} alt={album.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{album.title}</p>
                    <p className="text-xs text-gray-500">{album.album_images?.length ?? 0} images</p>
                  </div>
                </button>
              ))}
              {albums.length === 0 && <p className="text-sm text-gray-500">No albums yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{selectedAlbum ? selectedAlbum.title : "Select an album"}</CardTitle>
              {selectedAlbum && (
                <Button type="button" variant="outline" className="text-red-600" onClick={() => deleteAlbum(selectedAlbum)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete album
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedAlbum && (
                <>
                  <form onSubmit={uploadImages} className="flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1">
                      <Label htmlFor="album-images">Upload images</Label>
                      <Input
                        id="album-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => setImageFiles(event.target.files)}
                      />
                    </div>
                    <Button type="submit" disabled={saving || !imageFiles?.length}>
                      <ImagePlus className="h-4 w-4 mr-2" />
                      {saving ? "Uploading..." : "Upload"}
                    </Button>
                  </form>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {(selectedAlbum.album_images ?? []).map((image, index) => (
                      <div key={image.id} className="rounded-lg border bg-white p-3">
                        <div className="mb-3 aspect-video overflow-hidden rounded bg-gray-100">
                          <img src={galleryImageUrl(image.image_url)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => moveImage(index, 1)}
                            disabled={index === (selectedAlbum.album_images?.length ?? 0) - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => setCover(selectedAlbum, image)}>
                            Cover
                          </Button>
                          <Button type="button" size="sm" variant="outline" className="text-red-600" onClick={() => deleteImage(image)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(selectedAlbum.album_images?.length ?? 0) === 0 && (
                    <div className="rounded-lg border border-dashed bg-white p-8 text-center text-gray-500">No images in this album yet.</div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Media Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={saveMediaItem} className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="media-type">Type</Label>
                <select
                  id="media-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={mediaType}
                  onChange={(event) => setMediaType(event.target.value as MediaCenterItemType)}
                >
                  <option value="video">Video</option>
                  <option value="photo">Photo</option>
                  <option value="magazine">Magazine</option>
                </select>
              </div>
              <div>
                <Label htmlFor="media-title">Title</Label>
                <Input id="media-title" value={mediaTitle} onChange={(event) => setMediaTitle(event.target.value)} required />
              </div>
              <div>
                <Label htmlFor="media-order">Order</Label>
                <Input id="media-order" type="number" value={mediaOrder} onChange={(event) => setMediaOrder(Number(event.target.value))} />
              </div>
              {mediaType === "magazine" && (
                <div>
                  <Label htmlFor="media-pages">Pages</Label>
                  <Input id="media-pages" type="number" value={mediaPages} onChange={(event) => setMediaPages(Number(event.target.value))} />
                </div>
              )}
              {mediaType === "video" ? (
                <div className="md:col-span-2">
                  <Label htmlFor="youtube-url">YouTube link</Label>
                  <Input
                    id="youtube-url"
                    value={mediaUrl}
                    onChange={(event) => setMediaUrl(event.target.value)}
                    placeholder="https://youtu.be/..."
                    required
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  <Label htmlFor="media-file">{mediaType === "photo" ? "Photo" : "Magazine PDF"}</Label>
                  <Input
                    id="media-file"
                    type="file"
                    accept={mediaType === "photo" ? "image/*" : "application/pdf,.pdf"}
                    onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
                    required={!editingMedia}
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <Label htmlFor="media-thumb">Thumbnail / cover image</Label>
                <Input id="media-thumb" type="file" accept="image/*" onChange={(event) => setMediaThumbFile(event.target.files?.[0] ?? null)} />
              </div>
              <div className="flex items-end gap-2 md:col-span-2">
                <Button type="submit" disabled={saving}>
                  {editingMedia ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  {saving ? "Saving..." : editingMedia ? "Update item" : "Add item"}
                </Button>
                {editingMedia && (
                  <Button type="button" variant="outline" onClick={resetMediaForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              {mediaItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-lg border bg-white p-4 md:flex-row md:items-center">
                  <div className="h-20 w-32 overflow-hidden rounded bg-gray-100">
                    {item.thumbnail_url ? (
                      <img src={mediaCenterUrl(item.thumbnail_url)} alt={item.title} className="h-full w-full object-cover" />
                    ) : item.type === "photo" ? (
                      <img src={mediaCenterUrl(item.media_url)} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">{item.type}</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.type} · order {item.order_index}</p>
                    {item.type === "magazine" && <p className="text-xs text-gray-500">{item.pages ?? 0} pages</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEditMedia(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="text-red-600" onClick={() => deleteMediaItem(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {mediaItems.length === 0 && (
                <div className="rounded-lg border border-dashed bg-white p-8 text-center text-gray-500">
                  No Media Center items yet. The public page will keep using the existing videos, photos, and magazines until items are added.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
