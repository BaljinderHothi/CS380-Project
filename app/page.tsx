"use client"
import Header from "@/components/header"
import VigenereCipher from "@/components/vigenere-cipher"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <VigenereCipher />
      </main>
      <Footer />
    </div>
  )
}
