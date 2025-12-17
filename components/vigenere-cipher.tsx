"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CipherVisualization } from "./cipher-visualization"

function generateKey(str: string, key: string): string {
  let keyIndex = 0
  let result = ""

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    // Only generate key for alphabetic characters
    if (/[a-zA-Z]/.test(char)) {
      result += key[keyIndex++ % key.length]
    } else {
      result += char
    }
  }

  return result
}

function encryptText(plaintext: string, key: string): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const generatedKey = generateKey(plaintext, cleanKey)

  let result = ""
  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i]

    if (/[a-zA-Z]/.test(char)) {
      const charCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0)
      const keyCode = generatedKey[i].charCodeAt(0) - "A".charCodeAt(0)
      const encrypted = (charCode + keyCode) % 26
      result += String.fromCharCode(encrypted + "A".charCodeAt(0))
    } else {
      result += char
    }
  }

  return result
}

function decryptText(ciphertext: string, key: string): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const generatedKey = generateKey(ciphertext, cleanKey)

  let result = ""
  for (let i = 0; i < ciphertext.length; i++) {
    const char = ciphertext[i]

    if (/[a-zA-Z]/.test(char)) {
      const charCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0)
      const keyCode = generatedKey[i].charCodeAt(0) - "A".charCodeAt(0)
      const decrypted = (charCode - keyCode + 26) % 26
      result += String.fromCharCode(decrypted + "A".charCodeAt(0))
    } else {
      result += char
    }
  }

  return result
}

export default function VigenereCipher() {
  const [plaintext, setPlaintext] = useState("")
  const [keyword, setKeyword] = useState("")
  const [encryptedText, setEncryptedText] = useState("")
  const [decryptedText, setDecryptedText] = useState("")
  const [sideBySide, setSideBySide] = useState(true)
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")

  const handleEncrypt = () => {
    if (!plaintext || !keyword) {
      alert("Please enter both plaintext and keyword")
      return
    }

    const result = encryptText(plaintext, keyword)
    setEncryptedText(result)
  }

  const handleDecrypt = () => {
    if (!encryptedText || !keyword) {
      alert("Please enter both ciphertext and keyword")
      return
    }

    const result = decryptText(encryptedText, keyword)
    setDecryptedText(result)
  }

  const handlePlaintextChange = (value: string) => {
    setPlaintext(value)
    if (sideBySide && keyword && value) {
      setEncryptedText(encryptText(value, keyword))
    } else if (!value) {
      setEncryptedText("")
    }
  }

  const handleCiphertextChange = (value: string) => {
    setEncryptedText(value)
    if (sideBySide && keyword && value) {
      setDecryptedText(decryptText(value, keyword))
    } else if (!value) {
      setDecryptedText("")
    }
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    if (sideBySide && value) {
      if (plaintext) {
        setEncryptedText(encryptText(plaintext, value))
      }
      if (encryptedText) {
        setDecryptedText(decryptText(encryptedText, value))
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6 bg-card">
        <h2 className="text-2xl font-bold mb-2 text-card-foreground">Vigenère Cipher</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-card-foreground">Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="Enter keyword"
            className="w-full px-3 py-2 border border-input rounded bg-background text-foreground placeholder-muted-foreground"
          />
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSideBySide(true)}
            className={`px-4 py-2 rounded font-medium transition ${
              sideBySide ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setSideBySide(false)}
            className={`px-4 py-2 rounded font-medium transition ${
              !sideBySide ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Toggle Mode
          </button>
        </div>

        {sideBySide ? (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Plaintext</label>
                  <textarea
                    value={plaintext}
                    onChange={(e) => handlePlaintextChange(e.target.value)}
                    placeholder="Enter text to encrypt"
                    className="w-full px-3 py-2 border border-input rounded bg-background text-foreground placeholder-muted-foreground min-h-48"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Ciphertext</label>
                  <textarea
                    value={encryptedText}
                    onChange={(e) => handleCiphertextChange(e.target.value)}
                    placeholder="Encrypted text will appear here"
                    className="w-full px-3 py-2 border border-input rounded bg-background text-foreground placeholder-muted-foreground min-h-48"
                  />
                </div>
              </div>
            </div>
            {plaintext && keyword && <CipherVisualization plaintext={plaintext} keyword={keyword} mode="encrypt" />}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMode("encrypt")}
                className={`px-4 py-2 rounded font-medium transition flex-1 ${
                  mode === "encrypt" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setMode("decrypt")}
                className={`px-4 py-2 rounded font-medium transition flex-1 ${
                  mode === "decrypt" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Decrypt
              </button>
            </div>

            {mode === "encrypt" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Plaintext</label>
                  <textarea
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="Enter text to encrypt"
                    className="w-full px-3 py-2 border border-input rounded bg-background text-foreground placeholder-muted-foreground min-h-32"
                  />
                </div>
                <Button onClick={handleEncrypt} className="w-full bg-blue-600 hover:bg-blue-700">
                  Encrypt
                </Button>
                {encryptedText && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Ciphertext</label>
                    <div className="w-full px-3 py-2 border border-input rounded bg-background text-foreground min-h-32 overflow-auto whitespace-pre-wrap">
                      {encryptedText}
                    </div>
                  </div>
                )}
                {plaintext && keyword && <CipherVisualization plaintext={plaintext} keyword={keyword} mode="encrypt" />}
              </div>
            )}

            {mode === "decrypt" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-card-foreground">Ciphertext</label>
                  <textarea
                    value={encryptedText}
                    onChange={(e) => setEncryptedText(e.target.value)}
                    placeholder="Enter text to decrypt"
                    className="w-full px-3 py-2 border border-input rounded bg-background text-foreground placeholder-muted-foreground min-h-32"
                  />
                </div>
                <Button onClick={handleDecrypt} className="w-full bg-blue-600 hover:bg-blue-700">
                  Decrypt
                </Button>
                {decryptedText && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-card-foreground">Plaintext</label>
                    <div className="w-full px-3 py-2 border border-input rounded bg-background text-foreground min-h-32 overflow-auto whitespace-pre-wrap">
                      {decryptedText}
                    </div>
                  </div>
                )}
                {encryptedText && keyword && (
                  <CipherVisualization plaintext={encryptedText} keyword={keyword} mode="decrypt" />
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
