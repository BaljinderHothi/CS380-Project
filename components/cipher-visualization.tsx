"use client"

interface CipherVisualizationProps {
  plaintext: string
  keyword: string
  mode: "encrypt" | "decrypt"
}

function generateKeyArray(str: string, key: string): string[] {
  let keyIndex = 0
  const result: string[] = []

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (/[a-zA-Z]/.test(char)) {
      result.push(key[keyIndex++ % key.length])
    } else {
      result.push("")
    }
  }

  return result
}

function processText(plaintext: string, key: string, mode: "encrypt" | "decrypt"): string[] {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const keyArray = generateKeyArray(plaintext, cleanKey)

  const result: string[] = []
  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i]

    if (/[a-zA-Z]/.test(char)) {
      const charCode = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0)
      const keyCode = keyArray[i].charCodeAt(0) - "A".charCodeAt(0)

      let processed: number
      if (mode === "encrypt") {
        processed = (charCode + keyCode) % 26
      } else {
        processed = (charCode - keyCode + 26) % 26
      }

      result.push(String.fromCharCode(processed + "A".charCodeAt(0)))
    } else {
      result.push(char)
    }
  }

  return result
}

export function CipherVisualization({ plaintext, keyword, mode }: CipherVisualizationProps) {
  if (!plaintext || !keyword) {
    return null
  }

  const cleanKey = keyword.replace(/[^a-zA-Z]/g, "").toUpperCase()
  const keyArray = generateKeyArray(plaintext, cleanKey)
  const resultArray = processText(plaintext, keyword, mode)

  // Get only alphabetic positions for visual clarity
  const alphaIndices = plaintext
    .split("")
    .map((char, idx) => (/[a-zA-Z]/.test(char) ? idx : -1))
    .filter((idx) => idx !== -1)

  return (
    <div className="mt-8 p-4 bg-muted rounded-lg overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-card-foreground">
        {mode === "encrypt" ? "Encryption" : "Decryption"} Process
      </h3>

      <div className="space-y-3">
        {/* Plaintext Row */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
          </label>
          <div className="flex gap-1 mt-1 flex-wrap">
            {plaintext.split("").map((char, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono ${
                  /[a-zA-Z]/.test(char)
                    ? "bg-blue-100 text-blue-900 border-2 border-blue-300"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {char === " " ? "␣" : char}
              </div>
            ))}
          </div>
        </div>

        {/* Key Row */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase">Key</label>
          <div className="flex gap-1 mt-1 flex-wrap">
            {plaintext.split("").map((char, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono ${
                  /[a-zA-Z]/.test(char)
                    ? "bg-green-100 text-green-900 border-2 border-green-300"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {keyArray[idx] || ""}
              </div>
            ))}
          </div>
        </div>

        {/* Result Row */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            {mode === "encrypt" ? "Ciphertext" : "Plaintext"}
          </label>
          <div className="flex gap-1 mt-1 flex-wrap">
            {plaintext.split("").map((char, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono ${
                  /[a-zA-Z]/.test(char)
                    ? "bg-purple-100 text-purple-900 border-2 border-purple-300"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {resultArray[idx] || ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
