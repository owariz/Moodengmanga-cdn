import { Alert } from "@heroui/alert"
import ListFile from "@/components/ListFile"

export default function Home() {
  return (
    <>
      <Alert color={"warning"} description={"เว็บนี้ยังอยู่ในช่วยทดลองใช้งานหากพบเจอปัญหาโปรดติดต่อผู้พัฒนาระบบนะครับ"} title={"ประกาศสำคัญ!"} />

      <div className="w-full max-w-screen-2xl mt-5">
        <h1 className="text-xl ms:text-xl dark:text-white text-black font-semibold">
          ฝากไฟล์รูปภาพที่ Moodengmanga <span className="text-[#282524] mx-2">|</span>
          <span className="text-[#72716f]">เว็บสำหรับจัดการไฟล์รูปภาพของเว็บอ่านมังงะ</span>
        </h1>

        <hr className="border-gray-900 my-5" />

        <ListFile />
      </div>
    </>
  )
}
