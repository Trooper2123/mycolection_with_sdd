// src/components/BarcodeScanner.tsx
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Inicializa o scanner na div com id "reader"
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 260, height: 140 }, // Formato ideal para código de barras de livros
                formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13]
            },
      /* verbose= */ false
        );

        scannerRef.current.render(
            (text: string) => {
                onScanSuccess(text);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.error("Erro ao fechar o scanner", err));
                }
            },
            (error: string) => {
                // Erros de varredura contínua em tempo real (podem ser ignorados com segurança)
            }
        );

        // Cleanup: Desliga a câmera caso o usuário saia da tela
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Erro no desmonte do scanner", err));
            }
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl w-full max-w-md text-center">
                <h3 className="text-white text-lg font-bold mb-4">Escaneie o Código de Barras</h3>

                <div id="reader" className="overflow-hidden rounded-lg bg-slate-800 text-slate-300"></div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    );
};