import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2, UserRoundPen } from "lucide-react";
import { editarUsuario, deletarUsuario } from "@/api/usuario/usuario.service";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { encerrarSessao, obterUsuarioId } from "@/lib/auth";

export const Route = createFileRoute("/usuario/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const usuarioId = obterUsuarioId();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleEditar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    if (senha && senha !== confirmarSenha) {
      setErro("A confirmação da senha não confere com a senha informada.");
      return;
    }

    setIsPending(true);

    try {
      const dadosAtualizados = {
        ...(nome.trim() ? { nome: nome.trim() } : {}),
        ...(senha ? { senha } : {}),
      };

      if (!Object.keys(dadosAtualizados).length) {
        setErro("Informe pelo menos um nome ou uma nova senha para atualizar o usuário.");
        return;
      }

      await editarUsuario(usuarioId, dadosAtualizados);
      setSucesso("Dados do usuário atualizados com sucesso.");
      setNome("");
      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar o usuário. Tente novamente.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeletar() {
    const confirmado = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");

    if (!confirmado) {
      return;
    }

    setErro(null);
    setSucesso(null);
    setIsPending(true);

    try {
      await deletarUsuario(usuarioId);
      encerrarSessao();
      navigate({ to: "/" });
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setErro("Não foi possível excluir o usuário. Tente novamente.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[#52749a]">Configurações</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#172d46]">Minha conta</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundPen aria-hidden="true" className="size-5" />
            Editar usuário
          </CardTitle>
          <CardDescription>Atualize seu nome ou senha quando quiser.</CardDescription>
        </CardHeader>

        <form onSubmit={handleEditar} className="flex flex-col gap-5 p-6 pt-0">
          <div className="flex flex-col gap-2">
            <label htmlFor="usuario-nome" className="text-sm font-medium">Novo nome</label>
            <Input
              id="usuario-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Digite um novo nome"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="usuario-senha" className="text-sm font-medium">Nova senha</label>
            <Input
              id="usuario-senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite uma nova senha"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="usuario-confirmar-senha" className="text-sm font-medium">Confirmar nova senha</label>
            <Input
              id="usuario-confirmar-senha"
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Repita a nova senha"
              disabled={isPending}
            />
          </div>

          {erro && (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          {sucesso && (
            <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {sucesso}
            </p>
          )}

          <CardFooter className="flex justify-end gap-3 p-0 pt-2">
            <Button type="submit" disabled={isPending} className="min-w-36">
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-red-200 bg-red-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 aria-hidden="true" className="size-5" />
            Excluir usuário
          </CardTitle>
          <CardDescription className="text-red-700/80">
            Essa ação remove sua conta e todos os dados associados.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end p-6 pt-0">
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDeletar}
          >
            Excluir conta
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
