import { Injectable } from '@angular/core';

export interface AppContext {
  type: 'PUBLIC' | 'TENANT';
  isPublic: boolean;
  subdomain: string | null;
  tenantName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private context: AppContext | null = null;

  constructor() {
    this.resolveContext();
  }

  private resolveContext(): void {
    const hostname = window.location.hostname;
    const subdomain = this.extractSubdomain(hostname);

    if (subdomain && subdomain !== 'www') {
      // CONTEXTO DE TENANT
      this.context = {
        type: 'TENANT',
        isPublic: false,
        subdomain: subdomain
      };
      console.log(`✅ Tenant context: ${subdomain}`);
    } else {
      // CONTEXTO PÚBLICO
      this.context = {
        type: 'PUBLIC',
        isPublic: true,
        subdomain: null
      };
      console.log(`✅ Public context`);
    }
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    // Si hay más de 2 partes (ej: tenant1.dominio.com), el primer parte es el subdominio
    return parts.length > 2 ? parts[0] : null;
  }

  getContext(): AppContext | null {
    return this.context;
  }

  isPublic(): boolean {
    return this.context?.isPublic ?? true;
  }

  isTenant(): boolean {
    return !this.isPublic();
  }

  getSubdomain(): string | null {
    return this.context?.subdomain ?? null;
  }

  getContextType(): 'PUBLIC' | 'TENANT' {
    return this.context?.type ?? 'PUBLIC';
  }
}
