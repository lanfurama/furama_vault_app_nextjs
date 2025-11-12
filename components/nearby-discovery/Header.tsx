import { PinIcon } from './icons'

const Header = () => (
  <header className="my-8 text-center md:my-12">
    <div className="mb-2 flex items-center justify-center gap-4">
      <PinIcon className="h-10 w-10 text-blue-500" />
      <h1 className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
        Nearby Discovery
      </h1>
    </div>
    <p className="text-lg text-gray-500">
      Find your next favorite spot, powered by Gemini.
    </p>
  </header>
)

export default Header

