import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonCol, IonGrid, IonRow
} from '@ionic/angular/standalone';
import { PreferencesService } from '../services/preferences.service';
import { categorias, Pergunta, perguntas } from '../data/trivia';
import { Router } from '@angular/router';


const TEMPO = 20;

@Component({
  selector: 'app-playing',
  templateUrl: './playing.page.html',
  styleUrls: ['./playing.page.scss'],
  standalone: true,
  imports: [
    IonCard, IonContent, CommonModule, FormsModule, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton
  ]
})

export class PlayingPage implements OnInit {

  config = { modo: '', dificuldade: '', categoria: '', multplayer:false };
  perguntas: Pergunta[] = [];
  rodadas: Pergunta[][] = [];
  rodadaAtual = 0;
  tempoRestante = TEMPO;
  intervalo: any;
  pontuacao = 0;

  respostaCorreta: boolean | null = null; // Feedback visual
  respostaSelecionada: string | null = null; // Marca a opção clicada
  bloqueado = false; // Evita múltiplos cliques rápidos

  emPertida = true;

  constructor(
    private pf: PreferencesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadConfig()
  }

  async loadConfig() {
    const con = await this.pf.get(['modo', 'dificuldade', 'categoria'])
    con?.forEach((c) => {
      if (c.key == 'modo') this.config.modo = c.value;
      if (c.key == 'dificuldade') this.config.dificuldade = c.value;
      if (c.key == 'categoria') this.config.categoria = c.value;
      if (c.key == 'multlayer' && c.value == 'true') this.config.multplayer = true; else this.config.multplayer = false;
    })
    if (this.config.categoria !== 'geral') {
      this.perguntas = perguntas.filter(p => p.categoria === this.config.categoria && p.dificuldade === this.config.dificuldade);
    } else {
      this.perguntas = perguntas.filter(p => p.dificuldade === this.config.dificuldade);
    }
    console.log(this.config)
    console.log(this.perguntas)

    this.embaralharPerguntas();
    this.distribuirRodadas();
    this.iniciarRodada();
  }

  responder(opcao: string) {
    if (this.bloqueado) return; // Impede múltiplos cliques rápidos

    this.bloqueado = true;
    this.respostaSelecionada = opcao; // Marca a opção escolhida
    const perguntaAtual = this.rodadas[this.rodadaAtual][0];

    // Define se a resposta está correta
    this.respostaCorreta = perguntaAtual.resposta === opcao;

    this.cdr.detectChanges();

    if (this.respostaCorreta) {
      this.pontuacao += 10;
    }

    // Aguarda 1 segundo antes de avançar
    setTimeout(() => {
      this.rodadas[this.rodadaAtual].shift(); // Remove a pergunta respondida

      if (this.rodadas[this.rodadaAtual].length === 0) {
        this.proximaRodada();
      }

      if(!this.respostaCorreta && this.config.modo == "Mata Mata"){
        this.encerrarPartida();
      }

      // Reseta estados para próxima pergunta
      this.tempoRestante = TEMPO;
      this.respostaCorreta = null;
      this.respostaSelecionada = null;
      this.bloqueado = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  embaralharPerguntas() {
    this.perguntas.sort(() => Math.random() - 0.5); // Embaralha as perguntas aleatoriamente
  }

  distribuirRodadas() {
    this.rodadas = [];
    const totalRodadas = 8;
    const perguntasPorRodada = 4;

    for (let i = 0; i < totalRodadas; i++) {
      if (this.perguntas.length < perguntasPorRodada) break; // Se não houver perguntas suficientes, encerra
      this.rodadas.push(this.perguntas.splice(0, perguntasPorRodada)); // Pega 4 perguntas e remove da lista
    }
  }

  iniciarRodada() {
    if (this.rodadaAtual >= this.rodadas.length) {
      this.encerrarPartida();
      return;
    }
    if (this.config.modo == 'Temporizado' || this.config.modo == 'Mata Mata') {
      this.tempoRestante = TEMPO;
      this.iniciarTimer();
    }
  }

  iniciarTimer() {
    if (this.config.modo !== 'Temporizado' && this.config.modo !== 'Mata Mata') return;
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.tempoRestante--;
      if (this.tempoRestante === 0) {
        this.proximaRodada();
      }
    }, 1000);
  }

  proximaRodada() {
    if (this.config.modo === 'Temporizado' || this.config.modo == 'Mata Mata') {
      clearInterval(this.intervalo); // Apenas para o temporizador se estiver ativo
    }
    this.rodadaAtual++;
    this.iniciarRodada();
  }

  encerrarPartida() {
    clearInterval(this.intervalo);
    this.emPertida = false;
    console.log("Fim do jogo! Pontuação final:", this.pontuacao);
  }

  voltar() {
    this.pf.remove([
      'modo',
      'dificuldade',
      'categoria'
    ])
    this.pontuacao = 0;
    this.rodadaAtual = 0;
    this.tempoRestante = TEMPO;

    this.router.navigateByUrl('/home')
  }
}
