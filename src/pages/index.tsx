import Image from "next/image"
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  poolCount: number,
  guessCount: number,
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      });

      const { code } = response.data

      navigator.clipboard.writeText(code)
      
      alert('Bolão criado com sucesso! O código ' + code + ' foi copiado para a área de transferência!')

      setPoolTitle('')
    } catch (error) {
      console.error(error);
      alert('Falha ao criar o Bolão, tente novamente!')
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image 
          src={logoImg}
          alt="NLW Copa"
          quality={100}
        />

        <h1 className="mt-[60px] text-white text-5xl font-bold leading-tight">
          Crie o seu Próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image 
            src={usersAvatarExampleImg}
            alt=""
            quality={100}
          />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão usando!
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-gray-100"
            type="text" 
            required 
            placeholder="Qual nome do seu bolão?" 
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            className="bg-nlwYellow-500 px-6 py-4 rounded text-gray-900 font-bold uppercase hover:bg-nlwYellow-700"
            type="submit">
            CRIAR MEU BOLÃO
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas. 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 divide-x grid grid-cols-2 text-gray-100">
          <div className="flex items-center gap-6">
            <Image 
              src={iconCheckImg}
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões Criados</span>
            </div>
          </div>
          <div className="flex items-center gap-6 pl-14">
            <Image 
              src={iconCheckImg}
              alt=""
            />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>

      </main>
      <Image 
        src={appPreviewImg}
        alt="Prévia da aplicação móvel."
        quality={100}
      />
    </div>
  )
}


export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return { 
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}