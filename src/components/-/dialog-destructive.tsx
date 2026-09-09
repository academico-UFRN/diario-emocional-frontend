import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type React from "react"
import { Spinner } from "../ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckIcon } from "@hugeicons/core-free-icons"

type DestructiveModalProps = {
  title: string
  description: string
  triggerNode: React.ReactNode
  confirmNode: React.ReactNode
  isPending?: boolean
  isSuccess?: boolean
  onConfirm: () => void
}

export function DialogDestructive({ title, isPending, isSuccess, description, triggerNode, confirmNode, onConfirm }: DestructiveModalProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="destructive"> {triggerNode}</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <Button type="button" variant={isSuccess ? "default" : "destructive"} onClick={onConfirm} disabled={isPending}>
              {isPending ? <Spinner /> : isSuccess ? <HugeiconsIcon icon={CheckIcon} strokeWidth={2} /> : confirmNode}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
