"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { ArrowLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import { FileDetail } from "@/types/index"
import Masonry from "react-masonry-css"

interface FolderData {
  id: string
  filecount: string
  fileDetails: FileDetail[]
}

export default function FolderPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [files, setFiles] = useState<FileDetail[]>([])
  const [fileCount, setFileCount] = useState<string>("0 files")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/files/${id}`)
        const data: FolderData = res.data
        setFiles(data.fileDetails || [])
        setFileCount(data.filecount || "0 files")
      } catch (error) {
        console.error("Error fetching files:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [id])

  const handleDelete = (filename: string) => {
    console.log(`ลบไฟล์: ${filename}`)
  }

  const handleEdit = (filename: string) => {
    console.log(`แก้ไขไฟล์: ${filename}`)
  }

  return (
    <div className="p-6">
      <Button
        className="flex items-center gap-2 text-white w-48 mb-4"
        onClick={() => router.back()}
        color="danger" variant="flat"
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back to Folders
      </Button>

      <h2 className="text-xl font-semibold mb-1">Folder ID: {id}</h2>
      <p className="text-gray-500 text-sm mb-4">{fileCount}</p>

      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลด...</p>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีไฟล์ในโฟลเดอร์นี้</p>
      ) : (
        <Masonry
          breakpointCols={{ default: 4, 1024: 3, 768: 2, 500: 1 }}
          className="flex gap-6"
          columnClassName="masonry-column space-y-6"
        >

          {files.map((file) => (
            <Card key={file.filename} className="relative group rounded-lg overflow-hidden shadow-md">
              <CardBody>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/image/${id}/${file.filename}`}
                  alt={file.filename}
                  className="w-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button color="warning" variant="faded" size="md" onClick={() => handleEdit(file.filename)}>
                    <PencilIcon className="w-5 h-5" />
                  </Button>
                  <Button color="danger" variant="faded" size="md" onClick={() => handleDelete(file.filename)}>
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-center text-sm py-2">{file.filename}</p>
              </CardBody>
            </Card>
          ))}
        </Masonry>
      )}
    </div>
  )
}