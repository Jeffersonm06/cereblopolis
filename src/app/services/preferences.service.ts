import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

interface Item {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  check = false;

  constructor(
    private router: Router
  ) { }

  async init() {
    if (!this.check) {
      console.log('Init: Verificando checkIn...');
      let checked = await this.get(['checkIn']);
      console.log('Init: Resultado de get checkIn:', checked);

      if (!checked || checked.length === 0) {
        console.log('Init: checkIn não encontrado, redirecionando para /init');
        this.router.navigateByUrl('/');
        return;
      }
      this.check = true;
      console.log('Init: checkIn encontrado, redirecionando para /');
      this.router.navigateByUrl('/home');
    }
  }

  async checkIn() {
    console.log('CheckIn: Definindo checkIn como true...');
    let checked = await this.set([{ key: 'checkIn', value: 'true' }]);
    console.log('CheckIn: Resultado do set:', checked);

    if (checked == 'set ok') {
      console.log('CheckIn: Sucesso! Redirecionando para /home');
      const agora = new Date();
      const dia = agora.getDate().toString().padStart(2, '0');
      const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
      const ano = agora.getFullYear();
      const dataFormatada = `${dia}/${mes}/${ano}`;
      this.set([
        { key: 'userCreatedAt', value: `${dataFormatada}` }
      ])
      this.router.navigateByUrl('/home');
      return;
    }
    console.log('CheckIn: Falha ao definir checkIn');
    return false;
  }

  async set(items: Item[]) {
    try {
      console.log('Set: Salvando preferências...', items);
      for (let item of items) {
        await Preferences.set({
          key: item.key,
          value: item.value,
        });
      }
      console.log('Set: Preferências salvas com sucesso');
    } catch (error) {
      console.error('Set: Erro ao salvar preferências', error);
      return 'set error';
    }
    return 'set ok';
  }

  async get(keys: string[]) {
    try {
      console.log('Get: Buscando preferências...', keys);
      const items: Item[] = []
      for (let key of keys) {
        const { value } = await Preferences.get({ key });
        if (value != null) {
          items.push({ key, value: value });
        }
      }
      console.log('Get: Preferências recuperadas:', items);
      return items;
    } catch (error) {
      console.error('Get: Erro ao recuperar preferências', error);
      return;
    }
  }

  async remove(keys: string[]) {
    try {
      console.log('Remove: Removendo preferências...', keys);
      for (let key of keys) {
        await Preferences.remove({ key });
      }
      console.log('Remove: Preferências removidas com sucesso');
    } catch (error) {
      console.error('Remove: Erro ao remover preferências', error);
      return 'remove error';
    }
    return 'remove ok';
  }

  async clear() {
    try {
      console.log('Clear: Removendo todas as preferências...');
      await Preferences.clear();
    } catch {
      console.error('Clear: Erro ao remover todas as preferências');

    } finally {
      console.log('Clear: Preferências removidas com sucesso');
      location.reload()
    }

  }
}