function Tabuleiro(qtdPers = 4, qtdPersCmBots = 4)
{
	pxlsCadaPers = 149.6/qtdPersCmBots;

	//y
	let yCima = 60;
	let heightTerrenoDir = 162;
	let heightTerrenoEsq = 112;
	//x
	let xEsquerda = 0;
	let widthTerreno = 185;

	//(nomeLugar, preco, qtdDinheiroMuda, qtdFelicidadeMuda, precoPorCasa, qtdDinheiroMudaPorCasa,
	//x, y)
	this._terrenos = {
			 0: new Terreno("Portaria", 0, 0, 0, 0, 0,
			 			xEsquerda + 10, 								yCima), //PORTARIA
       1: new Terreno("Corredor", 6.00, -0.75, 0, 1.50, -0.50,
			 			xEsquerda + widthTerreno, 		yCima),
       2: new Terreno("Tenda", 5.50, -0.50, 0, 1.00, -0.50,
			 			xEsquerda + 2*widthTerreno - 5,	yCima),
 	     3: new Terreno("Bandeco", 12.00, -3.00, -20, 3.00, -0.75,
			 			xEsquerda + 3*widthTerreno, 	yCima),
   		 4: new Terreno("Ginásio", 5.00, -0.50, +10, 1.00, -0.75,
			 			xEsquerda + 4*widthTerreno, 	yCima),
   		 5: new Terreno("Notificações", 0, 0, 0, 0, 0,
			 			xEsquerda + 5*widthTerreno, 	yCima), //notificacao
   		 6: new Terreno("Posto", 6.50, -1.00, +20, 1.50, -0.75,
			 			xEsquerda + 5*widthTerreno, 	yCima + heightTerrenoDir + 4),
   		 7: new Terreno("Salas", 6.00, -0.75, -30, 1.25, -0.75,
			 			xEsquerda + 5*widthTerreno, 	yCima + 2*heightTerrenoDir + 25),
   		 8: new Terreno("SOE", 0, 0, 0, 0, 0,
				 		xEsquerda + 5*widthTerreno, 	yCima + 3*heightTerrenoDir), //SOE
   		 9: new Terreno("Caminho das Árvores", 5.00, -0.50, 0, 1.00, -0.50,
			 			xEsquerda + 4*widthTerreno-15,	yCima + 3*heightTerrenoDir),
   		10: new Terreno("Gráfica", 10.00, -1.25, 0, 0, 0,
						xEsquerda + 3*widthTerreno, 	yCima + 3*heightTerrenoDir),
   		11: new Terreno("Bombeiros", 7.00, -1.50, +20, 1.50, -1.00,
						xEsquerda + 2*widthTerreno-15,	yCima + 3*heightTerrenoDir),
   		12: new Terreno("Laboratórios", 6.50, -1.00, -30, 1.25, -1.00,
						xEsquerda + widthTerreno, 		yCima + 3*heightTerrenoDir),
   		13: new Terreno("Férias", 0, 0, +100, 0, 0,
						xEsquerda + 10,								yCima + 3*heightTerrenoDir), //ferias
   		14: new Terreno("Biblioteca", 5.00, -0.75, -10, 1.50, -1.50,
						xEsquerda + 10, 								yCima + 3*heightTerrenoEsq + 12.5),
   		15: new Terreno("Cantina", 15.00, -4.00, +20, 3.00, -0.50,
						xEsquerda + 10, 								yCima + 2*heightTerrenoEsq),
   		16: new Terreno("Armário", 6.25, -1.00, 0, 1.00, -0.75,
						xEsquerda + 10,								yCima + heightTerrenoEsq)
		};
	this._qtdTerrenos = 17;

  this._notificacoes = [
		new Notificacao("Você esqueceu seu RA! Dê uma passada lá no SOE como castigo. Tome mais cuidado da próxima vez...",
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
			-3, +20),
		new Notificacao("Iuri colocou um bloco na sua mochila :(", 0, -20)
	];

  this._indexPersonagemAtual = 0;
	this._personagens = new Array(qtdPersCmBots);
	for (let i = 0; i < qtdPersCmBots; i++)
	{
		let corPers;
		switch (i)
		{
			case 0:
				corPers = "black";
				break;
			case 1:
				corPers = "#D22C0C";
				break;
			case 2:
				corPers = "#DDE11A";
				break;
			case 3:
				corPers = "#8CCE0F";
				break;
			case 4:
				corPers = "#0EB3CD";
				break;
		}

		let img = new Image();
		img.src = "img/peao" + i + ".png";

		this._personagens[i] = new Personagem(xEsquerda + i*pxlsCadaPers, corPers, i >= qtdPers,
			img);
	}

	this.imgFundo = new Image();
	this.imgFundo.src = "img/Tabuleiro Banco Imobiliário.png";

	this.imgCasinha = new Image();
	this.imgCasinha.src = "img/casinha.png"
}

//OUTRAS IMAGENS TABULEIRO
Tabuleiro.prototype.imgFundo;
Tabuleiro.prototype.imgCasinha;


//notificacao
const _INDEX_NOTIFIC_SOE = 0;

//TERRENOS ESPECIAIS
//quando cair nos especiais, fazer coisas diferentes (notificação, SOE, Gráfica)
const _INDEX_NOTIFICACAO = 5;
const _INDEX_SOE = 8;
const _INDEX_GRAFICA = 10;
//outros
const _INDEX_FERIAS = 13;

Tabuleiro.prototype.procPersGirouDado = function(nDado)
{
	let pers = this._personagens[this._indexPersonagemAtual];

	/*
		result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu;
				1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
  	result[1] //acoesTerrenoAtual (notificacao ou soh oq aconteceu com o personagem naquele terreno)
		result[2] //ehNotificacao (boolean)
		result[3] //str deu volta
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
		result[2] = false;
	}else
	{
		this._mudarXOutrosPersMesmaTerreno();
		//se tem algum outro personagem na mesmo terreno que ele e na frente dele (no mesmo terreno), coloca esse personagem mais pra tras

		let deuVolta = pers.andarTerrenos(nDado);
		this._mudarXPers(pers);

		let terrenoAtual = this._terrenos[pers.indexTerrenoAtual];

		switch (pers.indexTerrenoAtual)
		{
			case _INDEX_NOTIFICACAO:
				//pegar notificacao aleatoria
				let indexNotific = Math.floor(Math.random()*this._notificacoes.length);
				let notificacao = this._notificacoes[indexNotific];

				//fazer alteracoes no pers
				notificacao.fazerAlteracoesPers(pers);
				result[1] = notificacao;
				result[2] = true; //eh notificacao
				if(indexNotific == _INDEX_NOTIFIC_SOE)
				{
					pers.prender();
					pers.indexTerrenoAtual = _INDEX_SOE;
				}
				break;
			case _INDEX_SOE:
				//nao estava preso antes
				pers.prender();
				result[1] = new Notificacao("Você foi preso! Para sair tire 6 no dado ou espere 3 rodadas!", 0, 0); //acoes usuario
				result[2] = false; //nao eh notificacao
				break;
			case 0:
				result[1] = new Notificacao("De volta ao início...", 0, 0); //acoes usuario
				result[2] = false; //nao eh notificacao
				break;
			case _INDEX_FERIAS:
				pers.mudarFelicidade(100);
				result[1] = new Notificacao("Você está de férias! Recuperou toda a sua felicidade!", 0, 100); //acoes usuario
				result[2] = false; //nao eh notificacao
				break;
			default:
				pers.mudarFelicidade(terrenoAtual.qtdFelicidadeMuda);

				if(terrenoAtual.indexDono>=0)
				{
					if(terrenoAtual.indexDono == this._indexPersonagemAtual)
					//se usuario eh o dono, muda soh felicidade
						result[1] = new Notificacao("Você caiu em um de seus terrenos!", 0, terrenoAtual.qtdFelicidadeMuda);
					else
					{
						let qtdDinheiroMuda = terrenoAtual._qtdDinheiroMuda;
						if(pers.indexTerrenoAtual == _INDEX_GRAFICA)
							qtdDinheiroMuda *= nDado;
						//considera casas no terreno
						qtdDinheiroMuda += terrenoAtual.getQtdDinheiroMudaTodasCasas();

						pers.mudarDinheiro(qtdDinheiroMuda);

						result[1] = new Notificacao("Você caiu no terreno do Personagem" + (terrenoAtual.indexDono+1) +
							"... Então ele vai receber parte do seu dinheiro!", qtdDinheiroMuda, terrenoAtual.qtdFelicidadeMuda);

						this._personagens[terrenoAtual.indexDono].mudarDinheiro(-qtdDinheiroMuda);
						//personagem que tem o terreno ganha dinheiro
					}
				}else
					result[1] = new Notificacao("Esse terreno não tem dono!", 0, terrenoAtual.qtdFelicidadeMuda);

				result[2] = false;
				break;
		}

		if(deuVolta)
		{
			result[3] = "Você completou mais uma volta! Por isso, ganhou R$" + _QTD_DINHEIRO_POR_VOLTA.toFixed(2);
			this.completouVolta(pers);
		}

		//personagem estah vivo ou morto (0 ou -1)
		if(pers.vivo)
			result[0] = 0;
		else
			result[0] = -1;
	}

	return result;
}

Tabuleiro.prototype.vetorLocationPersonagens = function()
{
	var vetorXYPers = new Array(this._personagens.length);

	for(let i = 0; i<vetorXYPers.length; i++)
	{
		let persAtual = this._personagens[i];
		if(persAtual.vivo)
			vetorXYPers[i] = {imgPeao: persAtual.imgPeao,
				x:persAtual.x, y:this._terrenos[persAtual.indexTerrenoAtual].y};
	}

	return vetorXYPers;
}

const pxlsCadaCasinha = 40;
Tabuleiro.prototype.vetorLocationCasinhas = function()
{
	var vetorXYCasinhas = new Array(0);
	var indexVetor = 0;

	for(let iT = 0; iT < this._qtdTerrenos; iT++)
	{
		let terrenoAtual = this._terrenos[iT];

		for (let iCasinhas = 0; iCasinhas < terrenoAtual._qtdCasinhas; iCasinhas++)
		{
			vetorXYCasinhas[indexVetor] = {x:terrenoAtual.x - 7 + iCasinhas*pxlsCadaCasinha, y:terrenoAtual.y + 35};
			indexVetor++;
		}
	}

	return vetorXYCasinhas;
}

Tabuleiro.prototype.pxlsCadaPers;
Tabuleiro.prototype._mudarXPers = function(pers)
{
	//funcao muda o personagem.X baseado no terreno que ele esta e quantas pessoas jah estao naquele terreno
	let qtdPersTerreno = 0;
	for(let i = 0; i<this._personagens.length; i++)
		if(i != this._indexPersonagemAtual //se nao eh o proprio personagem que acabou de andar
				&& this._personagens[i].indexTerrenoAtual == pers.indexTerrenoAtual) //se o personagem atual estah na mesmo terreno que ele
			qtdPersTerreno++;

	pers.x = this._terrenos[pers.indexTerrenoAtual].x + qtdPersTerreno*pxlsCadaPers;
}

Tabuleiro.prototype._mudarXOutrosPersMesmaTerreno = function()
{
	var personagemAtual = this._personagens[this._indexPersonagemAtual];
	for(let i = 0; i<this._personagens.length; i++)
		if(i != this._indexPersonagemAtual)
		{
			let pers = this._personagens[i];
			if(pers.indexTerrenoAtual == personagemAtual.indexTerrenoAtual && pers.x > personagemAtual.x)
			//se o personagem que vai andar esta na mesmo terreno do personagem do loop
			//(mas na frente dele)
				pers.x -= pxlsCadaPers;
		}
}

Tabuleiro.prototype.strTerrenoParaUsuario = function()
{
	return this._strTerrenoParaUsuario(this._personagens[this._indexPersonagemAtual].indexTerrenoAtual);
}

Tabuleiro.prototype._strTerrenoParaUsuario = function(indexTerreno)
{
	let terrenoAtual = this._terrenos[indexTerreno];
	var msg = "<b>" + terrenoAtual.nomeLugar.toUpperCase() + "</b>";

	switch (indexTerreno)
	{
		case 0: //inicio
			msg += "<br><i>Ganha R$3.00 por volta</i>";
			break;
		case _INDEX_NOTIFICACAO:
			msg += "<br><i>Você recebe uma notificação de algo que aconteceu naquele dia, " +
				"que vai fazer você perder ou ganhar dinheiro e/ou felicidade.</i>";
			break;
		case _INDEX_SOE:
			msg += "<br><i>Você é preso, pode ficar no máximo 3 rodadas, " +
				"porém se você conseguir tirar 6 no dado antes, você está livre.</i>";
			break;
		case _INDEX_FERIAS:
			msg += "<br><i>Felicidade = 100%</i>";
			break;
		default:
			if(terrenoAtual._qtdDinheiroMuda < 0)
			{
				msg += "<br><i>Aluguel:</i> R$" + terrenoAtual.getAluguel();
				if(indexTerreno == _INDEX_GRAFICA)
					msg += " x (Número do dado)";
			}else
			if(terrenoAtual._qtdDinheiroMuda != 0)
				msg += "<br><i>Ganha R$" + terrenoAtual.getQtdDinheiroMuda() + "</i>";

			if (terrenoAtual.qtdFelicidadeMuda != 0)
				msg += "<br><i>Felicidade:</i> " + Ajustar.IntegerComSinal(terrenoAtual.qtdFelicidadeMuda) + "%";

			if (terrenoAtual._preco > 0)
				msg += "<br><i>Preço terreno:</i> R$" + terrenoAtual.getPreco();

			if (terrenoAtual._precoPorCasa > 0)
				msg += "<br><i>Preço cada casa:</i> R$" + terrenoAtual.getPrecoPorCasa() +
					"<br><i>Adicional ao aluguel por casa:</i> R$" + terrenoAtual.getAdicionalAoAluguelPorCasinha();

			break;
	}

	return msg;
}

const _QTD_DINHEIRO_POR_VOLTA = 3.00;
Tabuleiro.prototype.completouVolta = function(pers)
{
	pers.mudarDinheiro(_QTD_DINHEIRO_POR_VOLTA);
}


//outros metodos importantes para o jogo em si
Tabuleiro.prototype.strPersonagemAtual = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	let msg = "<span style='font-size: 25px'><b style=\"color:" + pers.cor + "\">";
	if(!pers.vivo)
		return "<strike>" + msg + "Personagem " + (this._indexPersonagemAtual+1) + "</strike></b></span>";
	return msg + "Personagem " + (this._indexPersonagemAtual+1) + "</b><br>" +
		"<i>Dinheiro:</i> R$" + pers.getDinheiro() + "<br>" +
		"<i>Felicidade:</i> " + pers.felicidade + "%</span>";
}

Tabuleiro.prototype.strTodosPersonagens = function()
{
	var msg = "";

	for (let i = 0; i<this._personagens.length; i++)
	{
		var pers = this._personagens[i];
		let strPersAtual = "";
		let strBold = "<b style=\"color:" + pers.cor + "\">";

		if(!pers.vivo)
			strPersAtual += "<strike>" + strBold + "Personagem " + (i+1) + "</strike></b>";
		else
		{
			let strPropriedades = "";
			for (let iProp = 0; iProp<pers.propriedades.length; iProp++)
				strPropriedades += pers.propriedades[iProp] + (iProp==pers.propriedades.length-1?"":", ");

			strPersAtual += strBold + "Personagem " + (i+1) + "</b> " +
				"<i>(R$" + pers.getDinheiro() + ", " + "" + pers.felicidade + "%)</i>" + (strPropriedades==""?"":(": " + strPropriedades));
		}

		msg += strPersAtual + "<br>";
	}

	return msg;
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

	//doar todos os bens (terrenos e tirar casas) ao governo
	pers.tirarTodasPropriedades();
	for (let i = 0; i<this._qtdTerrenos; i++)
		if(this._terrenos[i].indexDono == this._indexPersonagemAtual)
		{
			this._terrenos[i].naoTemMaisDono();
			this._terrenos[i].zerarCasinhas();
		}
}


//buttons felicidade e terreno
const _QTD_FELICIDADE_COMPRA_POR_VEZ = 20;
const _PRECO_COMPRAR_FELICIDADE = 10;
Tabuleiro.prototype.persComprarFelicidade = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	pers.mudarFelicidade(_QTD_FELICIDADE_COMPRA_POR_VEZ);
	pers.mudarDinheiro(-_PRECO_COMPRAR_FELICIDADE);
}

Tabuleiro.prototype.persComprarTerreno = function()
{
	let pers = this._personagens[this._indexPersonagemAtual];
	let terreno = this._terrenos[pers.indexTerrenoAtual];
	terreno.comprar(pers, this._indexPersonagemAtual);
	return terreno.nomeLugar;
}

Tabuleiro.prototype.persComprarCasinha = function()
{
	let pers = this._personagens[this._indexPersonagemAtual];
	let terreno = this._terrenos[pers.indexTerrenoAtual];
	terreno.comprarCasinha(pers);

	let result = new Array(2);
	result[0] = terreno.nomeLugar;
	result[1] = "R$"+(- terreno.getQtdDinheiroMudaTodasCasas() - terreno._qtdDinheiroMuda).toFixed(2);
	return result;
}

Tabuleiro.prototype.persPodeComprarTerreno = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];

	if(!pers.vivo)
		return false;

	let indexTerrenoAtual = pers.indexTerrenoAtual;
	//se terreno eh especial e nao pode ser comprada
	if (indexTerrenoAtual == 0 || indexTerrenoAtual == _INDEX_NOTIFICACAO
		|| indexTerrenoAtual == _INDEX_SOE || indexTerrenoAtual == _INDEX_FERIAS)
		return false;

	//se terreno tem ou nao dono
	var terreno = this._terrenos[indexTerrenoAtual];
	return (terreno.indexDono < 0 && pers._dinheiro >= terreno._preco);
}

Tabuleiro.prototype.persPodeComprarCasinha = function()
{
	let pers = this._personagens[this._indexPersonagemAtual];
	let indexTerrenoAtual = pers.indexTerrenoAtual;

	//se usuario estah morto ou nao tem dinheiro para comprar casinha
	if(!pers.vivo || pers._dinheiro < this._terrenos[indexTerrenoAtual]._precoPorCasa)
		return false;

	let arrayNumeroTerrenos;
	switch(indexTerrenoAtual)
	{
		case 1:
		case 2:
			arrayNumeroTerrenos = [1, 2];
			break;
		case 3:
		case 4:
			arrayNumeroTerrenos = [3, 4];
			break;
		case 6:
		case 7:
			arrayNumeroTerrenos = [6, 7];
			break;
		case 9:
		case 11:
		case 12:
			arrayNumeroTerrenos = [9, 11, 12];
			break;
		case 14:
		case 15:
		case 16:
			arrayNumeroTerrenos = [14, 15, 16];
			break;
		default:
			return false;
	}

	//verifica se o personagem atual eh dono de todos os imoveis daquela rua
	for(let i = 0; i<arrayNumeroTerrenos.length; i++)
		if(this._terrenos[arrayNumeroTerrenos[i]].indexDono != this._indexPersonagemAtual)
			return false;

	return this._terrenos[indexTerrenoAtual].podeComprarCasinhaParaEsseTerreno();
}

Tabuleiro.prototype.persPodeComprarFelicidade = function()
{
	var pers = this._personagens[this._indexPersonagemAtual];
	if(!pers.vivo)
		return false;
	return (pers.felicidade < 100 && pers._dinheiro >= _PRECO_COMPRAR_FELICIDADE);
}


//BOT
Tabuleiro.prototype.persDeveComprarTerrenoOuCasinha = function()
{
	let pers = this._personagens[this._indexPersonagemAtual];
	if(this.personagemConsegueComprarTerreno())
		return (pers._dinheiro >= this._terrenos[pers.indexTerrenoAtual]._preco + 5)?1:0;
	else
	{
		if(this.persPodeComprarCasinha())
			return (pers._dinheiro >= this._terrenos[pers.indexTerrenoAtual]._precoPorCasa + 4)?2:0;
		return 0;
	}
}

Tabuleiro.prototype.persDeveComprarFelicidade = function()
{
	if(!this.personagemPodeComprarFelicidade())
		return false;

	let pers = this._personagens[this._indexPersonagemAtual];
	if(pers.felicidade > 50)
		return (pers.felicidade < 70) && pers._dinheiro > _PRECO_COMPRAR_FELICIDADE + 10;
	return ((pers.felicidade >= 30) && pers._dinheiro > _PRECO_COMPRAR_FELICIDADE + 5) ||
		((pers.felicidade < 30) && pers._dinheiro > _PRECO_COMPRAR_FELICIDADE + 3);
}

Tabuleiro.prototype.persEhBot = function()
{Atual
	return this._personagens[this._indexPersonagemAtual].ehBot;
}


//outros
Tabuleiro.prototype.getPrecoTerrenoPersAtual = function()
{
	return "R$" + this._terrenos[this._personagens[this._indexPersonagemAtual].indexTerrenoAtual].getPreco();
}

Tabuleiro.prototype.getFelicidadePersAtual = function()
{
	return this._personagens[this._indexPersonagemAtual].felicidade + "%";
}

Tabuleiro.prototype.getIndexPersonagemAtual = function()
{
	return this._indexPersonagemAtual+1;
}

Tabuleiro.prototype.getPersonagemAtual = function()
{
	return this._personagens[this._indexPersonagemAtual];
}
