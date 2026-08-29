import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feelings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/feelings/"!</div>
}
