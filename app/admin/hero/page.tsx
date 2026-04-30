"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowLeft, ArrowUp, Edit, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import { HeroSlide, HeroSlideType, heroMediaUrl, isStoragePath } from "@/lib/supabase/cms"

const emptyForm = {
  type: "image" as HeroSlideType,
  title: "",
  subtitle: "",
  youtubeUrl: "",
  orderIndex: 0,
}

function safeFileName(file: File) {
  return file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")
}

export default function AdminHeroPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<HeroSlide | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const fetchSlides = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("hero_slides")
      .select("id, type, media_url, title, subtitle, order_index, created_at")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      setMessage(error.message)
      setSlides([])
      return
    }

    setSlides((data as HeroSlide[]) ?? [])
    setForm((current) => ({
      ...current,
      orderIndex: data?.length ? Math.max(...data.map((row) => row.order_index)) + 1 : 0,
    }))
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
      await fetchSlides()
      setLoading(false)
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [fetchSlides, router])

  const resetForm = () => {
    setEditing(null)
    setFile(null)
    setForm({
      ...emptyForm,
      orderIndex: slides.length ? Math.max(...slides.map((slide) => slide.order_index)) + 1 : 0,
    })
  }

  const uploadMedia = async (slideId: string, selected: File) => {
    const supabase = createClient()
    const objectPath = `${slideId}/${Date.now()}-${safeFileName(selected)}`
    const { error } = await supabase.storage
      .from("hero-media")
      .upload(objectPath, selected, {
        contentType: selected.type,
        upsert: false,
      })

    if (error) throw error
    return objectPath
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const supabase = createClient()
      const basePayload = {
        type: form.type,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        order_index: Number(form.orderIndex) || 0,
      }

      if (editing) {
        let media_url = editing.media_url
        if (form.type === "youtube") {
          media_url = form.youtubeUrl.trim()
        } else if (file) {
          media_url = await uploadMedia(editing.id, file)
          if (isStoragePath(editing.media_url)) {
            await supabase.storage.from("hero-media").remove([editing.media_url])
          }
        }

        const { error } = await supabase
          .from("hero_slides")
          .update({ ...basePayload, media_url })
          .eq("id", editing.id)
        if (error) throw error
      } else {
        if (form.type === "youtube" && !form.youtubeUrl.trim()) {
          throw new Error("YouTube link is required.")
        }
        if (form.type !== "youtube" && !file) {
          throw new Error("Please choose an image or video file.")
        }

        const id = crypto.randomUUID()
        const media_url =
          form.type === "youtube" ? form.youtubeUrl.trim() : await uploadMedia(id, file as File)
        const { error } = await supabase.from("hero_slides").insert({
          id,
          ...basePayload,
          media_url,
        })
        if (error) throw error
      }

      resetForm()
      await fetchSlides()
      setMessage("Hero slide saved.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save slide.")
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (slide: HeroSlide) => {
    setEditing(slide)
    setFile(null)
    setForm({
      type: slide.type,
      title: slide.title ?? "",
      subtitle: slide.subtitle ?? "",
      youtubeUrl: slide.type === "youtube" ? slide.media_url : "",
      orderIndex: slide.order_index,
    })
  }

  const deleteSlide = async (slide: HeroSlide) => {
    if (!confirm("Delete this hero slide?")) return
    const supabase = createClient()
    const { error } = await supabase.from("hero_slides").delete().eq("id", slide.id)
    if (error) {
      setMessage(error.message)
      return
    }
    if (isStoragePath(slide.media_url)) {
      await supabase.storage.from("hero-media").remove([slide.media_url])
    }
    await fetchSlides()
  }

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const target = slides[index]
    const other = slides[index + direction]
    if (!target || !other) return

    const supabase = createClient()
    const { error: firstError } = await supabase
      .from("hero_slides")
      .update({ order_index: other.order_index })
      .eq("id", target.id)
    const { error: secondError } = await supabase
      .from("hero_slides")
      .update({ order_index: target.order_index })
      .eq("id", other.id)

    if (firstError || secondError) {
      setMessage(firstError?.message ?? secondError?.message ?? "Could not reorder slides.")
      return
    }
    await fetchSlides()
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-2">
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Hero Slider</h1>
            <p className="text-gray-600">Signed in as {role === "super_admin" ? "Super admin" : "Admin"}</p>
          </div>
        </div>

        {message && <div className="rounded-md border bg-white p-3 text-sm text-gray-700">{message}</div>}

        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit slide" : "Create slide"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">Media type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value as HeroSlideType })}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={form.orderIndex}
                  onChange={(event) => setForm({ ...form, orderIndex: Number(event.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={form.subtitle}
                  onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
                />
              </div>
              {form.type === "youtube" ? (
                <div className="md:col-span-2">
                  <Label htmlFor="youtube">YouTube link</Label>
                  <Input
                    id="youtube"
                    value={form.youtubeUrl}
                    onChange={(event) => setForm({ ...form, youtubeUrl: event.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  <Label htmlFor="media">Upload media</Label>
                  <Input
                    id="media"
                    type="file"
                    accept={form.type === "image" ? "image/*" : "video/*"}
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {editing ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {saving ? "Saving..." : editing ? "Update slide" : "Create slide"}
                  </Button>
                  {editing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {slides.map((slide, index) => (
              <div key={slide.id} className="flex flex-col gap-3 rounded-lg border bg-white p-4 md:flex-row md:items-center">
                <div className="h-24 w-40 overflow-hidden rounded bg-gray-100">
                  {slide.type === "image" ? (
                    <img src={heroMediaUrl(slide)} alt={slide.title ?? ""} className="h-full w-full object-cover" />
                  ) : slide.type === "video" ? (
                    <video src={heroMediaUrl(slide)} className="h-full w-full object-cover" muted />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">YouTube</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{slide.title || "Untitled slide"}</p>
                  <p className="text-sm text-gray-600">{slide.subtitle}</p>
                  <p className="text-xs text-gray-500">{slide.type} · order {slide.order_index}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => moveSlide(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => startEdit(slide)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="text-red-600" onClick={() => deleteSlide(slide)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {slides.length === 0 && (
              <div className="rounded-lg border border-dashed bg-white p-8 text-center text-gray-500">
                <Upload className="mx-auto mb-2 h-6 w-6" />
                No CMS slides yet. The public homepage will keep using the existing static slides until one is added.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
