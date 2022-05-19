import { BlocIdentité } from './BlocIdentité'

export const EntitéJuridique = ({ titre }: { titre: string}) => {
  return (
    <>
      <h1>
        {titre}
      </h1>
      <BlocIdentité />
    </>
  )
}
