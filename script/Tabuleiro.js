function Tabuleiro(qtdPers = 4)
{
	this._casas = {
					 0: new Casa("Portaria", 0, +2000, 0), //PORTARIA
                     1: new Casa("Corredor", 6.00, -0.75, 0),
                     2: new Casa("Tenda", 5.50, -0.50, 0),
               	     3: new Casa("Bandeco", 12.00, -3.00, 0),
               		 4: new Casa("Ginásio", 5.00, -0.50, +10),
               		 5: new Casa("Notificações", 0, 0, 0), //notificacao
               		 6: new Casa("Posto", 6.50, -1.00, +20),
               		 7: new Casa("Salas", 6.00, -0.75, -30),
               		 8: new Casa("SOI", 0, 0, 0), //SOI
               		 9: new Casa("Caminho das Árvores", 5.00, -0.50, 0),
               		10: new Casa("Gráfica", 10.00, -1.25, 0),
               		11: new Casa("Bombeiros", 7.00, -1.50, +20),
               		12: new Casa("Laboratórios", 6.50, -1.00, -30),
               		13: new Casa("Férias", 0, 0, +100), //ferias
               		14: new Casa("Biblioteca", 5.00, -0.75, -10),
               		15: new Casa("Cantina", 15.00, -4.00, +20),
               		16: new Casa("Armário", 6.20, -1.00, 0),
               	};

    this._notificacoes = {
    				0: new Notificacao("Você esqueceu seu RA! Tome mais cuidado da próxima vez...",
    					0, -20),
    				1: new Notificacao("Um professor faltou! Você sabe o que isso significa: aula livre!",
    					0, +20),
    				2: new Notificacao("Você foi mal numa prova que estava confiante... Que pena, esteja mais atento na próxima prova!",
    					0, -20),
    				3: new Notificacao("Você foi bem numa prova que achou que tinha ido mal... Que sortudo...",
    					0, +20),
    				4: new Notificacao("Você achou uma nota no chão!",
    					+10, +20),
    				5: new Notificacao("Você perdeu aquele dinheiro que tinha separado pro lanche! Agora vai ficar com fome e sem seu dinheiro...",
    					-4, -20),
    				6: new Notificacao("Hoje você vai ter aula com aquele professor que te odeia por nenhuma razão...",
    					0, -20),
    				7: new Notificacao("Seu amigo comprou um salgado na cantina pra você! Valorize amigos assim!",
    					0, +20),
    				8: new Notificacao("Seu ônibus atrasou! Agora você vai ter que pegar um uber...",
    					-10, -20),
    				9: new Notificacao("Vai ter futebol na aula de educação física!",
    					0, +20),
    				10: new Notificacao("Você pegou trânsito e não pôde entrar na primeira aula!",
    					0, -20),
					11: new Notificacao("Um professor elogiou seu comportamento na classe.",
    					0, +20),
 					12: new Notificacao("Prova surpresa! Ferrou!! Você só durmiu nas aulas desse professor!!",
    					0, -40),
 					13: new Notificacao("Você está muito cansado e já estudou muito hoje... por isso, merece um chocolate, certo?",
    					-3, +20),
               	};

    this._indexPersonagemAtual = 0;
	this._personagens = new Array(qtdPers);
	for (let i = 0; i < qtdPers; i++)
		this._personagens[i] = new Personagem();
}

const _QTD_NOTIFICACOES = 13;

//CASAS ESPECIAIS
//quando cair nos especiais, fazer coisas diferentes (notificação, SOI, Gráfica)
Tabuleiro.prototype._INDEX_NOTIFICACAO = 5;
Tabuleiro.prototype._INDEX_SOI = 8;
Tabuleiro.prototype._INDEX_GRAFICA = 10;
//outros
Tabuleiro.prototype._INDEX_FERIAS = 13;

Tabuleiro.prototype.procPersGirouDado = function(nDado)
{
	let pers = this._personagens[this._indexPersonagemAtual];

	/*
	result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu;
				1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
    result[1] //acoesCasaAtual (notificacao ou soh oq aconteceu com o personagem naquela casa)
    result[2] //string para mostrar ao usuario sobre casa atual
	result[3] //ehNotificacao (boolean)
	*/
	let result = new Array(4);


	if(pers.estahPreso())
	{
		if(nDado == 6)
		{
			pers.soltarUsuario();
			result[0] = 1;
		}
		else
		{
			pers.diminuirPrisao();
			result[0] = 2;
		}

		result[1] = null;
		result[3] = false;
	}else
	{
		pers.andarCasas(nDado);
		let casaAtual = this._casas[pers.pos];

		if(casaAtual.indexDono != this._indexPersonagemAtual)
		//usuario nao eh dono
		{
			switch (pers.pos)
			{
				case this._INDEX_NOTIFICACAO:
					//pegar notificacao aleatoria
					let indexNotific = Math.floor(Math.random()*_QTD_NOTIFICACOES);
					let notificacao = this._notificacoes[indexNotific];

					//fazer alteracoes no pers
					notificacao.fazerAlteracoesPers(pers);
					result[1] = notificacao;
					result[3] = true; //eh notificacao
					break;
				case this._INDEX_SOI:
					//nao estava preso antes
					pers.prender();
					result[1] = new Notificacao("Você foi preso! Para sair tire 6 no dado ou espere 3 rodadas!", 0, 0); //acoes usuario
					result[3] = false; //nao eh notificacao
					break;
				default:
					let qtdDinheiroMuda = casaAtual._qtdDinheiroMuda;
					if(pers.pos == this._INDEX_GRAFICA)
						qtdDinheiroMuda *= nDado;

					pers.mudarFelicidade(casaAtual.qtdFelicidadeMuda);
					pers.mudarDinheiro(qtdDinheiroMuda);

					result[1] = new Notificacao(null, qtdDinheiroMuda, casaAtual.qtdFelicidadeMuda);

					if(casaAtual.indexDono>=0)
					{
						this._personagens[casaAtual.indexDono].mudarDinheiro(-qtdDinheiroMuda);
						//personagem que tem a casa ganha dinheiro

						result[1].textoNotific = "Você caiu na casa do Personagem" + (casaAtual.indexDono+1) +
							"... Então ele é quem vai receber todo o seu dinheiro!";
					}

					result[3] = false;
					break;
			}
		}else
		{
			//se usuario eh o dono, muda soh felicidade
			pers.mudarFelicidade(casaAtual.qtdFelicidadeMuda);
			result[1] = new Notificacao("Você caiu numa casa que é sua!", 0, casaAtual.qtdFelicidadeMuda);
			result[3] = false;
		}

		//personagem estah vivo ou morto (0 ou -1)
		if(pers.vivo)
			result[0] = 0;
		else
			result[0] = -1;
	}

	result[2] = this._strCasaParaUsuario(this._casas[pers.pos], pers.pos);
	return result;
}

Tabuleiro.prototype.proximoPersonagem = function()
{
	this._indexPersonagemAtual++;
	if(this._indexPersonagemAtual >= this._personagens.length) //aqui ver se length existe alert(length)
		this._indexPersonagemAtual = 0;

	var indexGanhou = this._indexGanhou();

	if(indexGanhou < 0)
		while (!this._personagens[this._indexPersonagemAtual].vivo)
		{
			this._indexPersonagemAtual++;
			if(this._indexPersonagemAtual >= this._personagens.length)
				this._indexPersonagemAtual = 0;
		}

	if(indexGanhou >= 0)
		this._indexPersonagemAtual = indexGanhou;
	var result =
	{
		0: indexGanhou>=0, // se alguem ganhou (se soh resta um usuario)
		1: this._personagens[this._indexPersonagemAtual], //personagem
	};
	return result;
}

Tabuleiro.prototype.getPersonagemAtual = function()
{
	return this._personagens[this.indexPersonagemAtual];
}


//buttons felicidade e casa
const _qtdFelicidadeCompraFelicidade = 20;
const _qtdDinheiroCompraFelicidade = -10;
Tabuleiro.prototype.persComprarFelicidade = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	pers.mudarFelicidade(_qtdFelicidadeCompraFelicidade);
	pers.mudarDinheiro(_qtdDinheiroCompraFelicidade);
}

Tabuleiro.prototype.persComprarCasa = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	var casa = this._casas[pers.pos];
	casa.comprar(pers, this._indexPersonagemAtual);
	return casa.nomeLugar;
}

Tabuleiro.prototype.personagemConsegueComprarCasa = function()
{
	return this._persQualquerConsegueComprarCasa(this._personagens[this._indexPersonagemAtual]);
}

Tabuleiro.prototype.personagemPodeComprarFelicidade = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	if(!pers.vivo)
		return false;
	return (pers.felicidade < 100 && pers._dinheiro >= _qtdDinheiroCompraFelicidade);
}

//auxiliar
Tabuleiro.prototype._persQualquerConsegueComprarCasa = function(pers)
{
	if(!pers.vivo)
		return false;

	let pos = pers.pos;
	//se casa eh especial e nao pode ser comprada
	if (pos == 0 || pos == this._INDEX_NOTIFICACAO || pos == this._INDEX_SOI || pos == this._INDEX_FERIAS)
		return false;

	//se casa tem ou nao dono
	var casa = this._casas[pos];
	return (casa.indexDono < 0 && pers._dinheiro >= casa._preco);
}

Tabuleiro.prototype._strCasaParaUsuario = function(casaAtual, index)
{
	var msg = "Casa atual: " + casaAtual.nomeLugar.toUpperCase();

	switch (index)
	{
		case this._INDEX_FERIAS:
			msg += "\nFelicidade = 100%";
			break;
		case 0: //inicio
			msg += "\nGanha R$3.00 por volta";
			break;
		default:
			if(casaAtual._qtdDinheiroMuda < 0)
			{
				msg += "\nAluguel: R$" + casaAtual.getAluguel();
				if(index == this._INDEX_GRAFICA)
					msg += " x (Número do dado)";
			}else
			if(casaAtual._qtdDinheiroMuda != 0)
			{
				msg += "\nGanha R$" + casaAtual.getQtdDinheiroMuda();
				if(index == this._INDEX_GRAFICA)
					msg += " x (Número do dado)";
			}


			if (casaAtual.qtdFelicidadeMuda != 0)
				msg += "\nFelicidade: " + Ajustar.IntegerComSinal(casaAtual.qtdFelicidadeMuda) + "%";

			if (casaAtual._preco != 0)
				msg += "\nPreço: R$" + casaAtual.getPreco();

			break;
	}

	return msg;
}

Tabuleiro.prototype._indexGanhou = function()
{
	var qtdVivos = 0;
	var indexUltimoPersVivo = -1;
	for(let i = 0; i<this._personagens.length; i++)
		if(this._personagens[i].vivo)
		{
			qtdVivos++;
			indexUltimoPersVivo = i;
		}

	if(qtdVivos > 1)
		return -1;

	return indexUltimoPersVivo;
}


//TESTE
Tabuleiro.prototype._teste = function()
{
	let msg = "";
	for(let i = 0; i<this._personagens.length; i++)
		msg += "Personagem " + (i+1) + ": {Casa: " + this._personagens[i].pos + ", Dinheiro: " + this._personagens[i].getDinheiro()
			+ ", Felicidade: " + this._personagens[i].felicidade + ", Rodadas preso: " + this._personagens[i]._presoSOI + "} \n";

	alert(msg);
}
