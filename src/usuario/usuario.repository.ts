import { Injectable } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioRepository {
  private usuarios: UsuarioEntity[] = [];
  async criaUsuario(dadosDoUsuario: UsuarioEntity) {
    this.usuarios.push(dadosDoUsuario);

    console.log(this.usuarios);
  }

  async buscaUsuarios() {
    console.log(this.usuarios);
    return this.usuarios;
  }

  async existeComEmail(email: string) {
    return this.usuarios.find((u) => u.email === email);
  }

  async atualiza(id: string, novosDados: Partial<UsuarioEntity>) {
    const usuario = this.buscaPorId(id);

    Object.entries(novosDados).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      if (valor) {
        usuario[chave] = valor;
      }
    });

    return usuario;
  }

  private buscaPorId(id: string) {
    const usuarioExiste = this.usuarios.find((u) => u.id === id);

    if (!usuarioExiste) {
      throw new Error('Usuário não encontrado');
    }

    return usuarioExiste;
  }

  async remove(id: string) {
    const usuario = this.buscaPorId(id);

    this.usuarios = this.usuarios.filter((u) => u.id !== id);
    return usuario;
  }
}
