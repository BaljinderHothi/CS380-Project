export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">CS 380 Project</h1>
        <div className="text-blue-100 text-sm">{/* GitHub logo will go here */}</div>
      </div>
    </header>
  )
}
