import MainNavigation from "./main-navigation"

export default function Layout(props: any) {
  return (
    <>
      <MainNavigation />
      <main>{props.children}</main>
    </>
  )
}
