function Tabuleiro(qtdPers = 4)
{
	this._casas = {
					 				 0: new Casa("Portaria", 0, +2000, 0,					10, 20), //PORTARIA
                   1: new Casa("Corredor", 6.00, -0.75, 0,			160, 20),
                   2: new Casa("Tenda", 5.50, -0.50, 0,					210, 20),
             	     3: new Casa("Bandeco", 12.00, -3.00, 0,			360, 20),
               		 4: new Casa("Ginásio", 5.00, -0.50, +10, 		410, 20),
               		 5: new Casa("Notificações", 0, 0, 0, 				560, 20), //notificacao
               		 6: new Casa("Posto", 6.50, -1.00, +20,				560, 170),
               		 7: new Casa("Salas", 6.00, -0.75, -30, 			560, 320),
               		 8: new Casa("SOI", 0, 0, 0, 									560, 470), //SOI
               		 9: new Casa("Caminho das Árvores", 5.00, -0.50, 0, 410, 470),
               		10: new Casa("Gráfica", 10.00, -1.25, 0,			360, 470),
               		11: new Casa("Bombeiros", 7.00, -1.50, +20,		210, 470),
               		12: new Casa("Laboratórios", 6.50, -1.00, -30, 160, 470),
               		13: new Casa("Férias", 0, 0, +100, 						10, 470), //ferias
               		14: new Casa("Biblioteca", 5.00, -0.75, -10, 	10, 320),
               		15: new Casa("Cantina", 15.00, -4.00, +20, 		10, 170),
               		16: new Casa("Armário", 6.20, -1.00, 0, 			10, 20)
               	};
	this._qtdCasas = 17;

  this._notificacoes = [
    				new Notificacao("Você esqueceu seu RA! Tome mais cuidado da próxima vez...",
    					0, -20),
    				new Notificacao("Um professor faltou! Você sabe o que isso significa: aula livre!",
    					0, +20),
    				new Notificacao("Você foi mal numa prova que estava confiante... Que pena, esteja mais atento na próxima prova!",
    					0, -20),
    				new Notificacao("Você foi bem numa prova que achou que tinha ido mal... Que sortudo...",
    					0, +20),
    				new Notificacao("Você achou uma nota no chão!",
    					+10, +20),
    				new Notificacao("Você perdeu aquele dinheiro que tinha separado pro lanche! Agora vai ficar com fome e sem seu dinheiro...",
    					-4, -20),
    				new Notificacao("Hoje você vai ter aula com aquele professor que te odeia por nenhuma razão...",
    					0, -20),
    				new Notificacao("Seu amigo comprou um salgado na cantina pra você! Valorize amigos assim!",
    					0, +20),
    				new Notificacao("Seu ônibus atrasou! Agora você vai ter que pegar um uber...",
    					-10, -20),
    				new Notificacao("Vai ter futebol na aula de educação física!",
    					0, +20),
    				new Notificacao("Você pegou trânsito e não pôde entrar na primeira aula!",
    					0, -20),
						new Notificacao("Um professor elogiou seu comportamento na classe.",
    					0, +20),
 						new Notificacao("Prova surpresa! Ferrou!! Você só durmiu nas aulas desse professor!!",
    					0, -40),
 						new Notificacao("Você está muito cansado e já estudou muito hoje... por isso, merece um chocolate, certo?",
    					-3, +20)
				];

  this._indexPersonagemAtual = 0;
	this._personagens = new Array(qtdPers);
	for (let i = 0; i < qtdPers; i++)
	{
		this._personagens[i] = new Personagem();
		this._personagens[i].x += i*pxlsCadaPers;
	}
}

const _QTD_NOTIFICACOES = 13;

//CASAS ESPECIAIS
//quando cair nos especiais, fazer coisas diferentes (notificação, SOI, Gráfica)
const _INDEX_NOTIFICACAO = 5;
const _INDEX_SOI = 8;
const _INDEX_GRAFICA = 10;
//outros
const _INDEX_FERIAS = 13;

Tabuleiro.prototype.procPersGirouDado = function(nDado)
{
	let pers = this._personagens[this._indexPersonagemAtual];

	/*
		result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu;
				1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
  	result[1] //acoesCasaAtual (notificacao ou soh oq aconteceu com o personagem naquela casa)
  	result[2] //string para mostrar ao usuario sobre casa atual
		result[3] //ehNotificacao (boolean)
		result[4] //(x,y) dos personagens
	*/
	let result = new Array(5);

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
		this._mudarXPers(pers);

		let casaAtual = this._casas[pers.pos];

		switch (pers.pos)
		{
			case _INDEX_NOTIFICACAO:
				//pegar notificacao aleatoria
				let indexNotific = Math.floor(Math.random()*_QTD_NOTIFICACOES);
				let notificacao = this._notificacoes[indexNotific];

				//fazer alteracoes no pers
				notificacao.fazerAlteracoesPers(pers);
				result[1] = notificacao;
				result[3] = true; //eh notificacao
				break;
			case _INDEX_SOI:
				//nao estava preso antes
				pers.prender();
				result[1] = new Notificacao("Você foi preso! Para sair tire 6 no dado ou espere 3 rodadas!", 0, 0); //acoes usuario
				result[3] = false; //nao eh notificacao
				break;
			default:
				pers.mudarFelicidade(casaAtual.qtdFelicidadeMuda);

				if(casaAtual.indexDono>=0)
				{
					if(casaAtual.indexDono == this._indexPersonagemAtual)
					//se usuario eh o dono, muda soh felicidade
						result[1] = new Notificacao("Você caiu numa casa que é sua!", 0, casaAtual.qtdFelicidadeMuda);
					else
					{
						let qtdDinheiroMuda = casaAtual._qtdDinheiroMuda;
						if(pers.pos == _INDEX_GRAFICA)
							qtdDinheiroMuda *= nDado;

						pers.mudarDinheiro(qtdDinheiroMuda);

						result[1] = new Notificacao("Você caiu na casa do Personagem" + (casaAtual.indexDono+1) +
							"... Então ele é quem vai receber todo o seu dinheiro!", qtdDinheiroMuda, casaAtual.qtdFelicidadeMuda);

						this._personagens[casaAtual.indexDono].mudarDinheiro(-qtdDinheiroMuda);
						//personagem que tem a casa ganha dinheiro
					}
				}else
					result[1] = new Notificacao("Essa casa ainda é desabitada!", 0, casaAtual.qtdFelicidadeMuda);

				result[3] = false;
				break;
		}

		//personagem estah vivo ou morto (0 ou -1)
		if(pers.vivo)
			result[0] = 0;
		else
			result[0] = -1;
	}

	result[2] = this._strCasaParaUsuario(this._casas[pers.pos], pers.pos);
	result[4] = this.vetorLocationPersonagens();
	return result;
}

Tabuleiro.prototype.vetorLocationPersonagens = function()
{
	var vetorXYPers = new Array(this._personagens.length);

	for(let i = 0; i<vetorXYPers.length; i++)
	{
		let persAtual = this._personagens[i];
		if(persAtual.vivo)
			vetorXYPers[i] = {x:persAtual.x, y:this._casas[persAtual.pos].y};
	}

	return vetorXYPers;
}

const pxlsCadaPers = 20;
Tabuleiro.prototype._mudarXPers = function(pers, indexPers)
{
	//funcao muda o personagem.X baseado na casa que ele esta e quantas pessoas jah estao naquela casa
	let qtdPersCasa = 0;
	for(let i = 0; i<this._personagens.length; i++)
		if(i != indexPers)
			qtdPersCasa++;

	pers.x = this._casas[pers.pos].x + qtdPersCasa*pxlsCadaPers;
}

Tabuleiro.prototype._strCasaParaUsuario = function(casaAtual, index)
{
	var msg = "<b>" + casaAtual.nomeLugar.toUpperCase() + "</b><i>";

	switch (index)
	{
		case 0: //inicio
			msg += "<br>Ganha R$3.00 por volta";
			break;
		case _INDEX_NOTIFICACAO:
			msg += "<br>Você recebe uma notificação de algo que aconteceu naquele dia, " +
				"que vai fazer você perder ou ganhar dinheiro e/ou felicidade.";
			break;
		case _INDEX_SOI:
			msg += "<br>Você é preso, pode ficar no máximo 3 rodadas, " +
				"porém se você conseguir tirar 6 no dado antes, você está livre.";
			break;
		case _INDEX_FERIAS:
			msg += "<br>Felicidade = 100%";
			break;
		default:
			if(casaAtual._qtdDinheiroMuda < 0)
			{
				msg += "<br>Aluguel: R$" + casaAtual.getAluguel();
				if(index == _INDEX_GRAFICA)
					msg += " x (Número do dado)";
			}else
			if(casaAtual._qtdDinheiroMuda != 0)
			{
				msg += "<br>Ganha R$" + casaAtual.getQtdDinheiroMuda();
				if(index == _INDEX_GRAFICA)
					msg += " x (Número do dado)";
			}

			if (casaAtual.qtdFelicidadeMuda != 0)
				msg += "<br>Felicidade: " + Ajustar.IntegerComSinal(casaAtual.qtdFelicidadeMuda) + "%";

			if (casaAtual._preco != 0)
				msg += "<br>Preço: R$" + casaAtual.getPreco();

			break;
	}

	msg += "</i>";
	return msg;
}


//outros metodos importantes para o jogo em si
Tabuleiro.prototype.strPersonagemAtual = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	return "<b>Personagem " + (this._indexPersonagemAtual+1) + "</b><br>" +
		"<i>Dinheiro: R$" + pers.getDinheiro() + "<br>" +
		"Felicidade: " + pers.felicidade + "%</i>";
}

Tabuleiro.prototype.proximoPersonagem = function()
{
	//muda index para o primeiro personagem vivo depois do atual
	do
	{
		this._indexPersonagemAtual++;
		if(this._indexPersonagemAtual >= this._personagens.length)
			this._indexPersonagemAtual = 0;
	}while (!this._personagens[this._indexPersonagemAtual].vivo);
}

Tabuleiro.prototype.indexPersonagemGanhou = function()
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

Tabuleiro.prototype.procPersonagemAtualMorreu = function()
{
	let pers = this._personagens[this._indexPersonagemAtual];
	pers._dinheiro = -1;
	pers.felicidade = 0;

	//doar todos os bens (casas) ao governo
	for (let i = 0; i<this._qtdCasas; i++)
		if(this._casas[i].indexDono == this._indexPersonagemAtual)
			this._casas[i].indexDono = -1;
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
	let pers = this._personagens[this._indexPersonagemAtual];
	let casa = this._casas[pers.pos];
	casa.comprar(pers, this._indexPersonagemAtual);
	return casa.nomeLugar;
}

Tabuleiro.prototype.personagemConsegueComprarCasa = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];

	if(!pers.vivo)
		return false;

	let pos = pers.pos;
	//se casa eh especial e nao pode ser comprada
	if (pos == 0 || pos == _INDEX_NOTIFICACAO || pos == _INDEX_SOI || pos == _INDEX_FERIAS)
		return false;

	//se casa tem ou nao dono
	var casa = this._casas[pos];
	return (casa.indexDono < 0 && pers._dinheiro >= casa._preco);
}

Tabuleiro.prototype.personagemPodeComprarFelicidade = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	if(!pers.vivo)
		return false;
	return (pers.felicidade < 100 && pers._dinheiro >= _qtdDinheiroCompraFelicidade);
}


//outros
Tabuleiro.prototype.getIndexPersonagemAtual = function()
{
	return this._indexPersonagemAtual+1;
}

Tabuleiro.prototype.getPersonagemAtual = function()
{
	return this._personagens[this._indexPersonagemAtual];
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
