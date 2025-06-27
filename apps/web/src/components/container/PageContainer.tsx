import { Helmet } from 'react-helmet-async'

type Props = {
  description?: string
  children: JSX.Element | JSX.Element[]
  title?: string
}
const PageContainer = ({ title, description, children }: Props) => {
  console.log('renderizou PageContainer')
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
  )
}

export default PageContainer
