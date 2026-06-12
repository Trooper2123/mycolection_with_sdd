import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemApiService } from './services/item-api.service';
import { ItemRequest, ItemResponse, TipoMidia } from './models/item.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly tiposMidia: TipoMidia[] = ['LIVRO', 'QUADRINHO', 'MANGA', 'JOGO'];

  readonly filterForm = this.fb.group({
    categoria: ['']
  });

  readonly itemForm = this.fb.group({
    nome: ['', [Validators.required]],
    tipoMidia: ['LIVRO' as TipoMidia, [Validators.required]],
    categorias: ['', [Validators.required]],
    descricao: [''],
    tags: [''],
    console: ['']
  });

  items: ItemResponse[] = [];
  page = 0;
  size = 10;
  totalPages = 1;
  loading = false;
  message = '';
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly itemApi: ItemApiService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(page = this.page): void {
    this.loading = true;
    const categoria = this.filterForm.value.categoria ?? '';
    this.itemApi.list(page, this.size, categoria).subscribe({
      next: (response) => {
        this.items = response.content;
        this.page = response.number;
        this.totalPages = Math.max(response.totalPages, 1);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message = this.getErrorMessage(err);
      }
    });
  }

  submitItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const request$ = this.isEditing && this.editingId !== null
      ? this.itemApi.update(this.editingId, payload)
      : this.itemApi.create(payload);

    request$.subscribe({
      next: () => {
        this.message = this.isEditing ? 'Item atualizado com sucesso.' : 'Item criado com sucesso.';
        this.cancelEdit();
        this.loadItems(0);
      },
      error: (err) => {
        this.message = this.getErrorMessage(err);
      }
    });
  }

  editItem(item: ItemResponse): void {
    this.isEditing = true;
    this.editingId = item.id;
    this.itemForm.patchValue({
      nome: item.nome,
      tipoMidia: item.tipoMidia,
      categorias: item.categorias.join(', '),
      descricao: item.descricao ?? '',
      tags: item.tags ?? '',
      console: item.console ?? ''
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingId = null;
    this.itemForm.reset({
      nome: '',
      tipoMidia: 'LIVRO',
      categorias: '',
      descricao: '',
      tags: '',
      console: ''
    });
  }

  deleteItem(item: ItemResponse): void {
    const emprestado = Boolean(item.dataRetirada || item.dataDevolucao);
    const justificativa = emprestado
      ? window.prompt('Item emprestado: informe uma justificativa para marcar como perdido:')
      : '';

    if (emprestado && !justificativa?.trim()) {
      this.message = 'A justificativa e obrigatoria para remover item emprestado.';
      return;
    }

    this.itemApi.delete(item.id, justificativa ?? '').subscribe({
      next: () => {
        this.message = 'Item removido com sucesso.';
        this.loadItems();
      },
      error: (err) => {
        this.message = this.getErrorMessage(err);
      }
    });
  }

  emprestar(itemId: number): void {
    this.itemApi.emprestar(itemId).subscribe({
      next: () => {
        this.message = 'Emprestimo registrado.';
        this.loadItems();
      },
      error: (err) => {
        this.message = this.getErrorMessage(err);
      }
    });
  }

  devolver(itemId: number): void {
    this.itemApi.devolver(itemId).subscribe({
      next: () => {
        this.message = 'Devolucao registrada.';
        this.loadItems();
      },
      error: (err) => {
        this.message = this.getErrorMessage(err);
      }
    });
  }

  canEmprestar(item: ItemResponse): boolean {
    // Usa o campo derivado pelo BFF — remove lógica de apresentação do frontend
    return item.statusEmprestimo === 'Disponível';
  }

  canDevolver(item: ItemResponse): boolean {
    return item.statusEmprestimo === 'Emprestado';
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.loadItems(this.page + 1);
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.loadItems(this.page - 1);
    }
  }

  applyFilter(): void {
    this.loadItems(0);
  }

  private buildPayload(): ItemRequest {
    const raw = this.itemForm.getRawValue();
    const categorias = (raw.categorias ?? '')
      .split(',')
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    return {
      nome: (raw.nome ?? '').trim(),
      tipoMidia: (raw.tipoMidia ?? 'LIVRO') as TipoMidia,
      categorias,
      descricao: raw.descricao?.trim() || undefined,
      tags: raw.tags?.trim() || undefined,
      console: raw.console?.trim() || undefined
    };
  }

  private getErrorMessage(err: unknown): string {
    const response = err as { error?: { message?: string }; message?: string };
    return response?.error?.message || response?.message || 'Erro inesperado ao comunicar com a API.';
  }
}
