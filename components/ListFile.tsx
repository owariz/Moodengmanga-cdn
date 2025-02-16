"use client"

import axios from "axios"
import { FileDetail } from "@/types"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardBody } from "@heroui/card"
import { FolderIcon, TrashIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"

export default function ListFile() {
    const [groupedFiles, setGroupedFiles] = useState<{ [id: string]: FileDetail[] }>({})
    const [loading, setLoading] = useState(true)
    const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)
    const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [previewIndex, setPreviewIndex] = useState(0)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter()

    useEffect(() => {
        const GetAllfile = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/storage/files`)
                const files: FileDetail[] = res.data.fileDetails || []
                const grouped = files.reduce((acc, file) => {
                    if (!acc[file.id]) {
                        acc[file.id] = []
                    }
                    acc[file.id].push(file)
                    return acc
                }, {} as { [id: string]: FileDetail[] })

                setGroupedFiles(grouped)
            } catch (error) {
                console.error(`Error: ${error}`);
            } finally {
                setLoading(false)
            }
        }

        GetAllfile()
    }, [])

    const handleDeleteFolder = async (id: string) => {
        if (confirm("คุณต้องการลบโฟลเดอร์นี้ใช่หรือไม่?")) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/storage/folder/${id}`)
                setGroupedFiles((prev) => {
                    const updated = { ...prev }
                    delete updated[id]
                    return updated
                })
            } catch (error) {
                console.error("Error deleting folder:", error)
            }
        }
    }

    useEffect(() => {
        if (hoveredFolder && groupedFiles[hoveredFolder]?.length > 0) {
            setPreviewIndex(0)
            const interval = setInterval(() => {
                setPreviewIndex((prev) =>
                    (prev + 1) % groupedFiles[hoveredFolder].length
                )
            }, 2000)

            return () => clearInterval(interval)
        }
    }, [hoveredFolder, groupedFiles])

    return (
        <div className="p-6 relative">
            {loading ? (
                <p className="text-center text-gray-500">กำลังโหลด...</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(groupedFiles).map((id) => (
                        <div
                            key={id}
                            className="relative"
                            onMouseEnter={() => {
                                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                hoverTimeoutRef.current = setTimeout(() => setHoveredFolder(id), 500);
                            }}
                            onMouseLeave={() => {
                                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                setHoveredFolder(null);
                            }}
                            onMouseMove={(e) => setPreviewPos({ x: e.clientX, y: e.clientY })}
                        >
                            <Card
                                isPressable
                                onDoubleClick={() => router.push(`/folder/${id}`)}
                                className="p-4 flex flex-col items-center justify-center border-2 border-orange-400/5 ease-out hover:bg-orange-400/20 hover:border-orange-400/20"
                            >
                                <CardHeader className="flex justify-center">
                                    <FolderIcon className="w-12 h-12 text-yellow-500" />
                                </CardHeader>
                                <CardBody className="text-center">
                                    <span className="text-gray-500">Folder</span>
                                    <p className="text-lg font-semibold">{id}</p>
                                    <p className="text-sm text-gray-500">{groupedFiles[id].length} files</p>
                                </CardBody>
                            </Card>

                            {hoveredFolder === id && groupedFiles[id]?.length > 0 && (
                                <div
                                    className="fixed z-50 pointer-events-none transition-all ease-out duration-300 bg-white/30 shadow-lg p-3 border border-white/30 rounded-lg backdrop-blur-lg"
                                    style={{
                                        top: `${previewPos.y + 10}px`,
                                        left: `${previewPos.x + 10}px`,
                                        width: "280px"
                                    }}
                                >
                                    <p className="text-xs text-white font-semibold">Preview:</p>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/image/${groupedFiles[id]?.[previewIndex]?.id}/${groupedFiles[id]?.[previewIndex]?.filename}`}
                                        alt="Preview"
                                        className="w-full h-auto rounded transition-opacity ease-in-out duration-500 opacity-100 scale-100"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
