import Link from 'next/link'

const ErrorView = () => {
  return (
    <div className='bg-neo-bg flex min-h-screen flex-col items-center justify-center p-8 text-center'>
      <div className='animate-neo-pop'>
        <div className='border-neo border-neo-border bg-neo-pink shadow-neo-xl mx-auto mb-6 flex h-28 w-28 items-center justify-center'>
          <span className='text-5xl'>🔍</span>
        </div>
        <h1 className='text-neo-3xl text-neo-black'>404</h1>
        <p className='text-neo-base text-neo-gray-500 mt-3'>Aradığınız sayfa bulunamadı.</p>
        <Link
          href='/'
          className='border-neo border-neo-border bg-neo-yellow text-neo-sm text-neo-black shadow-neo transition-neo duration-neo hover:shadow-neo-lg active:shadow-neo-none mt-6 inline-block px-6 py-3 hover:-translate-x-0.5 hover:-translate-y-0.5 active:-translate-x-0.5 active:-translate-y-0.5'
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default ErrorView
