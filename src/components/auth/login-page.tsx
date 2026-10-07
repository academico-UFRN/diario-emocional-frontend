import { useState, type FormEvent } from "react";
import axios from "axios";
import { ArrowRight, BookHeart, LockKeyhole, Sparkles } from "lucide-react";
import { criarUsuario, loginUsuario } from "@/api/usuario/usuario.service";
import type { ErrorResponse } from "@/api/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salvarUsuarioId } from "@/lib/auth";

interface LoginPageProps {
	onLogin: (usuarioId: number) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
	const [nome, setNome] = useState("");
	const [senha, setSenha] = useState("");
	const [nomeCadastro, setNomeCadastro] = useState("");
	const [senhaCadastro, setSenhaCadastro] = useState("");
	const [confirmarSenhaCadastro, setConfirmarSenhaCadastro] = useState("");
	const [erro, setErro] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [modoCadastro, setModoCadastro] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErro(null);
		setIsPending(true);

		try {
			const usuarioId = await loginUsuario({ nome: nome.trim(), senha });
			salvarUsuarioId(usuarioId);
			onLogin(usuarioId);
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse>(error)) {
				const status = error.response?.status;
				setErro(
					status === 400 || status === 401 || status === 403
						? "Nome ou senha incorretos. Confira os dados e tente novamente."
						: status && status >= 500
							? "O serviço está temporariamente indisponível. Tente novamente em instantes."
							: !error.response
								? "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
								: "Não foi possível entrar agora. Tente novamente. Se o problema continuar, contate o suporte.",
				);
			} else {
				setErro("Não foi possível concluir o login. Tente novamente.");
			}
		} finally {
			setIsPending(false);
		}
	}

	async function handleCriarUsuario(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setErro(null);
		setIsPending(true);

		try {
			if (!nomeCadastro.trim() || !senhaCadastro || !confirmarSenhaCadastro) {
				setErro("Preencha nome, senha e confirmação da senha.");
				return;
			}

			if (senhaCadastro !== confirmarSenhaCadastro) {
				setErro("A confirmação da senha não confere com a senha informada.");
				return;
			}

			const usuarioId = await criarUsuario({
				nome: nomeCadastro.trim(),
				senha: senhaCadastro,
			});

			salvarUsuarioId(usuarioId);
			onLogin(usuarioId);
		} catch (error) {
			if (axios.isAxiosError<ErrorResponse>(error)) {
				const status = error.response?.status;
				setErro(
					status === 400
						? "Não foi possível criar o usuário. Verifique os dados e tente novamente."
						: status === 409
							? "Este nome de usuário já está em uso. Escolha outro."
							: status && status >= 500
								? "O serviço está temporariamente indisponível. Tente novamente em instantes."
								: !error.response
									? "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
									: "Não foi possível criar o usuário agora. Tente novamente.",
				);
			} else {
				setErro("Não foi possível criar o usuário. Tente novamente.");
			}
		} finally {
			setIsPending(false);
		}
	}

	const renderFormularioLogin = () => (
		<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
			<div className="flex flex-col gap-2">
				<label htmlFor="login-nome" className="text-sm font-medium">Nome</label>
				<Input
					id="login-nome"
					autoComplete="username"
					value={nome}
					onChange={(event) => setNome(event.target.value)}
					placeholder="Seu nome de usuário"
					required
					disabled={isPending}
					className="h-11 rounded-lg border-[#d6e1ed] bg-white px-3"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="login-senha" className="text-sm font-medium">Senha</label>
				<div className="relative">
					<LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8295aa]" />
					<Input
						id="login-senha"
						type="password"
						autoComplete="current-password"
						value={senha}
						onChange={(event) => setSenha(event.target.value)}
						placeholder="Sua senha"
						required
						disabled={isPending}
						className="h-11 rounded-lg border-[#d6e1ed] bg-white pl-10"
					/>
				</div>
			</div>

			{erro && (
				<p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-800">
					{erro}
				</p>
			)}

			<Button
				type="submit"
				disabled={isPending}
				className="mt-1 h-11 w-full justify-between rounded-lg bg-[#24558a] px-4 text-white hover:bg-[#1b456f]"
			>
				{isPending ? "Entrando..." : "Entrar"}
				<ArrowRight aria-hidden="true" className="size-4" />
			</Button>
			<Button
				type="button"
				variant="outline"
				disabled={isPending}
				onClick={() => setModoCadastro(true)}
				className="h-11 w-full rounded-lg border-[#d6e1ed] bg-white"
			>
				Criar usuário
			</Button>
		</form>
	);

	const renderFormularioCadastro = () => (
		<form className="flex flex-col gap-5" onSubmit={handleCriarUsuario}>
			<div className="flex flex-col gap-2">
				<label htmlFor="cadastro-nome" className="text-sm font-medium">Nome</label>
				<Input
					id="cadastro-nome"
					autoComplete="username"
					value={nomeCadastro}
					onChange={(event) => setNomeCadastro(event.target.value)}
					placeholder="Escolha um nome de usuário"
					required
					disabled={isPending}
					className="h-11 rounded-lg border-[#d6e1ed] bg-white px-3"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="cadastro-senha" className="text-sm font-medium">Senha</label>
				<div className="relative">
					<LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8295aa]" />
					<Input
						id="cadastro-senha"
						type="password"
						autoComplete="new-password"
						value={senhaCadastro}
						onChange={(event) => setSenhaCadastro(event.target.value)}
						placeholder="Crie sua senha"
						required
						disabled={isPending}
						className="h-11 rounded-lg border-[#d6e1ed] bg-white pl-10"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="cadastro-confirmar-senha" className="text-sm font-medium">Confirmar senha</label>
				<div className="relative">
					<LockKeyhole aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8295aa]" />
					<Input
						id="cadastro-confirmar-senha"
						type="password"
						autoComplete="new-password"
						value={confirmarSenhaCadastro}
						onChange={(event) => setConfirmarSenhaCadastro(event.target.value)}
						placeholder="Repita sua senha"
						required
						disabled={isPending}
						className="h-11 rounded-lg border-[#d6e1ed] bg-white pl-10"
					/>
				</div>
			</div>

			{erro && (
				<p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-800">
					{erro}
				</p>
			)}

			<div className="flex gap-3">
				<Button
					type="button"
					variant="outline"
					disabled={isPending}
					onClick={() => {
						setModoCadastro(false);
						setErro(null);
					}}
					className="h-11 flex-1 rounded-lg border-[#d6e1ed] bg-white"
				>
					Voltar
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					className="h-11 flex-1 rounded-lg bg-[#24558a] px-4 text-white hover:bg-[#1b456f]"
				>
					{isPending ? "Criando..." : "Criar conta"}
				</Button>
			</div>
		</form>
	);

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eff5fb] px-5 py-10 text-[#172d46]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_18%,rgba(164,199,235,0.48),transparent_36%),radial-gradient(ellipse_at_88%_82%,rgba(188,218,244,0.55),transparent_34%)]"
			/>
			<div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#d7e3f0] bg-[#fffefa]/90 shadow-[0_28px_80px_-48px_rgba(28,57,91,0.36)] md:min-h-[590px] md:grid-cols-[1.05fr_0.95fr]">
				<section className="relative flex flex-col justify-between overflow-hidden bg-[#183b63] p-8 text-[#f4f8fd] md:p-8 lg:p-12">
					<div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border border-white/10" />
					<div aria-hidden="true" className="absolute -bottom-36 -left-24 size-96 rounded-full border border-white/10" />
					<div className="relative flex items-center gap-3">
						<span className="flex size-11 items-center justify-center rounded-xl bg-[#dceafb] text-[#183b63]">
							<BookHeart aria-hidden="true" className="size-5" />
						</span>
						<span className="text-sm font-semibold tracking-wide">DIÁRIO EMOCIONAL</span>
					</div>
					<div className="relative my-12 max-w-md">
						<p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c7dafa]">
							<Sparkles aria-hidden="true" className="size-4" />
							Um espaço para você
						</p>
						<h1 className="text-4xl font-semibold leading-tight md:text-4xl lg:text-5xl">
							Cuide das suas emoções.
						</h1>
						<p className="mt-5 max-w-sm text-base leading-7 text-[#d6e4f5]">
							Registre seus dias, perceba seus sentimentos e acompanhe seus hábitos com gentileza.
						</p>
					</div>
					<p className="relative text-xs text-[#c7dafa]">Seu diário, no seu tempo.</p>
				</section>

				<section className="flex items-center justify-center px-6 py-10 md:px-12">
					<div className="w-full max-w-sm">
						<div className="mb-8">
							<p className="text-sm font-medium text-[#52749a]">{modoCadastro ? "Crie sua conta" : "Que bom ter você aqui"}</p>
							<h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172d46]">
								{modoCadastro ? "Cadastrar usuário" : "Entrar na sua conta"}
							</h2>
							<p className="mt-2 text-sm leading-6 text-[#64768a]">
								{modoCadastro ? "Defina seu nome de usuário e senha." : "Use seu nome e senha para continuar."}
							</p>
						</div>

						{modoCadastro ? renderFormularioCadastro() : renderFormularioLogin()}
					</div>
				</section>
			</div>
		</main>
	);
}