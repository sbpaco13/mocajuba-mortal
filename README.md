# Mocajuba Mortal — versão online

Cada pessoa joga do próprio celular, de casa. Até 8 carros por partida. Se faltar gente, bots completam as vagas.

O jogo precisa de um pequeno servidor na internet que guarde as salas e repasse os movimentos entre os celulares. Abaixo está o passo a passo para colocar esse servidor no ar de graça. A configuração é feita uma vez só e leva uns 15 minutos.

---

## 1. Colocar os arquivos no GitHub

1. Crie uma conta em **https://github.com** se você ainda não tiver.
2. No canto superior direito, clique em **+ → New repository**.
   - Nome: `mocajuba-mortal`
   - Pode deixar **Private** (privado).
   - Clique em **Create repository**.
3. Na página do repositório novo, clique no link **uploading an existing file**.
4. Descompacte o `.zip` no computador e **arraste para a página tudo o que está dentro da pasta** `mocajuba-online`: os arquivos `server.js`, `package.json`, `render.yaml`, `LEIA-ME.md` e a pasta `public`.
5. Clique em **Commit changes**.

> Confira se a pasta `public` subiu com o `index.html` e a subpasta `vendor` dentro dela.

## 2. Publicar no Render (gratuito)

1. Entre em **https://render.com** e clique em **Get Started**. Escolha **entrar com o GitHub**, que facilita o resto.
2. No painel, clique em **New + → Blueprint**.
3. Autorize o Render a ver o repositório `mocajuba-mortal` e selecione-o.
4. O Render lê o arquivo `render.yaml` sozinho e mostra o serviço **mocajuba-mortal** no plano **Free**. Clique em **Apply** (ou **Deploy Blueprint**).
5. Aguarde de 2 a 4 minutos. Quando aparecer **Live**, o endereço do jogo fica no topo da página do serviço. Será algo como:

   **https://mocajuba-mortal.onrender.com**

   O final do endereço pode mudar se esse nome já estiver em uso.

Se preferir não usar o Blueprint: **New + → Web Service**, escolha o repositório e preencha *Build Command* `npm install`, *Start Command* `npm start`, *Instance Type* **Free**.

### Sobre o plano gratuito
- Se ninguém usar o jogo por **15 minutos**, o servidor "dorme". O primeiro que abrir o endereço depois disso espera **cerca de 1 minuto** até ele acordar. Depois disso fica rápido para todos.
- Durante a partida o servidor não dorme, porque os celulares estão trocando mensagens o tempo todo.
- Dica: abra o endereço uns minutos antes de chamar a turma.

## 3. Jogar

1. **Quem organiza** abre o endereço no celular, escreve o nome, escolhe o carro e toca em **🌐 Criar sala online**.
2. Aparece o código da sala (por exemplo **MOC-K27**). Toque em **📲 Convidar** e mande o link pelo WhatsApp.
3. **Cada sobrinho** abre o link, escreve o nome, escolhe o carro e toca em **Entrar na sala**. Também dá para digitar só o código.
   - Se o celular dele estava com outra cidade aberta, o jogo recarrega sozinho com a cidade da sala. Isso leva alguns segundos.
4. Quem criou a sala (👑) escolhe o **Total de carros** (8 por padrão; os bots completam) e toca em **COMEÇAR**.
5. No fim da partida, todos tocam em **VOLTAR À SALA** e o anfitrião pode começar outra.

**Controles no celular** (jogue com o celular deitado):
- Polegar esquerdo: arraste para os lados na barra **◀ ⇆ ▶** para virar.
- Polegar direito: **ACELERA**, **RÉ**, **ARMA** e **FREIO de mão**.
- Eliminado: toque nos lados da barra de direção para trocar o jogador que você está assistindo.

**No computador** funciona igual, com teclado: W A S D ou setas, Espaço para a arma, Shift para o freio de mão.

### Bom saber
- O anfitrião (👑) é quem "dirige" os bots. Se ele sair do jogo ou trocar de aplicativo no meio da partida, os bots param até ele voltar. Se ele sair de vez, outro jogador vira anfitrião automaticamente e assume os bots.
- Se alguém fechar o jogo no meio da partida, o carro dele é eliminado ("saiu da partida").
- No iPhone, o Safari não deixa o jogo ocupar a tela toda. Para ficar melhor, use **Compartilhar → Adicionar à Tela de Início** e abra pelo ícone.
- Os gráficos já começam no modo **Leve** no celular. Se o celular for bom, dá para trocar para **Médio** no menu.
- Cidade nº: quem cria a sala define a cidade. Para jogar em outra cidade, troque o número (ou toque em 🎲) **antes** de criar a sala.

## 4. Atualizar o jogo depois

Se eu te mandar uma versão nova, basta abrir o repositório no GitHub, clicar em **Add file → Upload files**, arrastar os arquivos novos por cima e confirmar. O Render publica a nova versão sozinho em alguns minutos.

## 5. Testar no próprio computador (opcional)

Com o [Node.js](https://nodejs.org) instalado:

```
cd mocajuba-online
npm install
npm start
```

Abra **http://localhost:3000** no navegador. Celulares na mesma rede Wi-Fi podem entrar pelo IP do computador (ex.: `http://192.168.0.10:3000`).

---
Mapa: © colaboradores do OpenStreetMap (ODbL). Som do motor: gravação "car throttle static" de tanweraman (Pixabay, Licença de Conteúdo Pixabay). Gráficos 3D: three.js (licença MIT, em `public/vendor/three/LICENSE`).
