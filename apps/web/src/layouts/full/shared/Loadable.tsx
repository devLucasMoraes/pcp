import { ComponentType, PropsWithChildren, Suspense } from 'react'

const Loadable = <T extends object>(Component: ComponentType<T>) => {
  return function LoadableWrapper(props: PropsWithChildren<T>): JSX.Element {
    return (
      <Suspense>
        <Component {...props} />
      </Suspense>
    )
  }
}

export default Loadable
