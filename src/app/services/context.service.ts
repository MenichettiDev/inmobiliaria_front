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
    // Ignorar IPs (127.0.0.1, ::1, etc)
    if (hostname === '127.0.0.1' || hostname === '::1' || hostname.startsWith('[::')) {
      return null;
    }

    // Ignorar localhost sin subdominio
    if (hostname === 'localhost') {
      return null;
    }

    const parts = hostname.split('.');

    // Caso 1: tenant.localhost (2 partes)
    if (parts.length === 2 && parts[1] === 'localhost') {
      return parts[0]; // Retorna el subdominio
    }

    // Caso 2: tenant.dominio.com (3+ partes)
    if (parts.length > 2) {
      const subdomain = parts[0];
      // Asegurar que no es una IP (todos los parts son números)
      const isNumericIP = parts.every(part => /^\d+$/.test(part));
      return isNumericIP ? null : subdomain;
    }

    return null;
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
