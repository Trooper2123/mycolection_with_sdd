// src/components/MediaForm.tsx
import React, { useState } from "react";
import { BarcodeScanner } from "./BarcodeScanner";
import { CategoriaMidia, StatusMidia, DetalhesEspecificos } from "../types/media";

interface MediaFormProps {
    onSalvar: (dados: {
        titulo: string;
        categoria: CategoriaMidia;
        status: StatusMidia;
        nota: number;
        especificos: DetalhesEspecificos;
        capa_url?: string
    }) => void;
}

export const MediaForm: React.FC<MediaFormProps> = ({ onSalvar }) => {
    const [categoria, setCategoria] = useState<CategoriaMidia>("livro");
    const [status, setStatus] = useState<StatusMidia>("Lendo");
    const [titulo, setTitulo] = useState<string>("");
    const [nota, setNota] = useState<number>(5);
    const [isbn, setIsbn] = useState<string>("");

    const [especificos, setEspecificos] = useState<DetalhesEspecificos>({});
    const [capaUrl, setCapaUrl] = useState<string>("");

    const [mostrarScanner, setMostrarScanner] = useState<boolean>(false);
    const [carregandoApi, setCarregandoApi] = useState<boolean>(false);

    const buscarDadosPorISBN = async (codigoIsbn: string) => {
        if (!codigoIsbn) return;
        setCarregandoApi(true);
        const isbnLimpo = codigoIsbn.replace(/[-\s]/g, "");

        try {
            const response = await fetch(`https://openlibrary.org{isbnLimpo}&format=json&jscmd=data`);
            const data = await response.json();
            const chave = `ISBN:${isbnLimpo}`;

            if (data[chave]) {
                const info = data[chave];
                setTitulo(info.title || "");
                setCapaUrl(info.cover?.medium || "");

                setEspecificos({
                    autor: info.authors?.[0]?.name || "Desconhecido",
                    editora: info.publishers?.[0]?.name || "Desconhecida",
                    paginas: info.number_of_pages || 0,
                });
            } else {
                alert("ISBN não localizado na base global. Preencha manualmente.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do livro:", error);
        } finally {
            setCarregandoApi(false);
        }
    };

    const handleScanSuccess = (codigoDetectado: string) => {
        setIsbn(codigoDetectado);
        setMostrarScanner(false);
        buscarDadosPorISBN(codigoDetectado);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) return alert("O título é obrigatório!");

        onSalvar({
            titulo: titulo.trim(),
            categoria,
            status,
            nota,
            especificos,
            capa_url: capaUrl
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-4 max-w-md mx-auto">
            <div>
                <label className="block text-sm font-semibold mb-1 text-slate-400">Categoria</label>
                <select
                    value={categoria}
                    onChange={(e) => {
                        setCategoria(e.target.value as CategoriaMidia);
                        setEspecificos({});
                        setCapaUrl("");
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                    <option value="livro">📚 Livro</option>
                    <option value="manga">⛩️ Mangá</option>
                    <option value="quadrinho">🦸 Quadrinho</option>
                    <option value="jogo">🎮 Jogo</option>
                </select>
            </div>

            {(categoria === "livro" || categoria === "manga" || categoria === "quadrinho") && (
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400">Preenchimento por ISBN</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Digite o código ISBN"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => buscarDadosPorISBN(isbn)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            Buscar
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMostrarScanner(true)}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        📷 Escanear com a Câmera
                    </button>
                </div>
            )}

            {mostrarScanner && (
                <BarcodeScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setMostrarScanner(false)}
                />
            )}

            {carregandoApi && <p className="text-sm text-amber-400 animate-pulse text-center">Buscando informações do ISBN...</p>}

            {capaUrl && (
                <div className="flex justify-center">
                    <img src={capaUrl} alt="Capa encontrada" className="h-32 object-cover rounded shadow-md border border-slate-700" />
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold mb-1 text-slate-400">Título</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: O Hobbit"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
            </div>

            {categoria === "jogo" ? (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Plataforma</label>
                        <input
                            type="text"
                            placeholder="PS5, PC..."
                            value={especificos.plataforma || ""}
                            onChange={(e) => setEspecificos({ ...especificos, plataforma: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Tempo (Horas)</label>
                        <input
                            type="number"
                            placeholder="40"
                            value={especificos.tempo_jogo || ""}
                            onChange={(e) => setEspecificos({ ...especificos, tempo_jogo: Number(e.target.value) })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Autor / Roteirista</label>
                        <input
                            type="text"
                            value={especificos.autor || ""}
                            onChange={(e) => setEspecificos({ ...especificos, autor: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Editora</label>
                        <input
                            type="text"
                            value={especificos.editora || ""}
                            onChange={(e) => setEspecificos({ ...especificos, editora: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                </div>
            )}

            {(categoria === "manga" || categoria === "quadrinho") && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Volume Atual</label>
                        <input
                            type="number"
                            value={especificos.volume_atual || ""}
                            onChange={(e) => setEspecificos({ ...especificos, volume_atual: Number(e.target.value) })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Total Volumes</label>
                        <input
                            type="number"
                            value={especificos.total_volumes || ""}
                            onChange={(e) => setEspecificos({ ...especificos, total_volumes: Number(e.target.value) })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Status de Consumo</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as StatusMidia)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                    >
                        <option value="Lendo">Lendo 📖</option>
                        <option value="Jogando">Jogando 🎮</option>
                        <option value="Lido">Lido ✅</option>
                        <option value="Zerado">Zerado 🏆</option>
                        <option value="Quero Comprar">Quero Comprar 🛒</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-1">Nota Pessoal</label>
                    <select
                        value={nota}
                        onChange={(e) => setNota(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {"⭐".repeat(n)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={!titulo}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-base font-bold disabled:opacity-50 transition-colors mt-2"
            >
                Salvar Item
            </button>
        </form>
    );
};

export default MediaForm;
