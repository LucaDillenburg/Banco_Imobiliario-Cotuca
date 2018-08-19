	var tabuleiro;

	var etapa = 0;
	//0: esperando pra colocar dado girando
	//1: dado girando
	//2: mostrando informacoes casa
	//3: pode comprar casa, alegria ou passar vez

	//output
	var objContexto;
	//imagens
	var imgPeoesPers;
	var imgFundo = new Image();
	imgFundo.src = "img/Tabuleiro Banco Imobiliário.png";

	//INICIO
	function iniciar()
	{
		objContexto = document.getElementById("meuCanvas").getContext("2d");

		let qtdPers = 4;
		tabuleiro = new Tabuleiro(qtdPers);
		imgPeoesPers = new Array(qtdPers);
		for (var i = 0; i < qtdPers; i++)
		{
			imgPeoesPers[i] = new Image();

			if(i == qtdPers-1)
				imgPeoesPers[qtdPers-1].onload = function()
				{
					comecarJogo();
				}

			imgPeoesPers[i].src = "img/peao" + (i + 1) + ".png";
		}
	}

	function comecarJogo()
	{
		colocarPeoesNaTela(tabuleiro.vetorLocationPersonagens());
		colocarRodadaNaTela();
		setInterval(aumentarContagemDado, 70);
	}

	//TELA
	function colocarRodadaNaTela()
	{
		etapa = 0;

		//colocar na tela: informacoes do usuario que vai jogar
		//tabuleiro._teste();
		document.getElementById("informacoesPersCasa").innerHTML = tabuleiro.strPersonagemAtual();

		//girar o dado depois de um tempo
		setTimeout(comecarGirarDado, 500);
	}

	function colocarPeoesNaTela(vetorXYPers)
	{
		objContexto.drawImage(imgFundo, 0, 0, 1088, 624); //300 -> 1088, 150 -> 624
		for(let i = 0; i<vetorXYPers.length; i++)
			if(vetorXYPers != null)
				objContexto.drawImage(imgPeoesPers[i], vetorXYPers[i].x, vetorXYPers[i].y, 54.4, 62.4);
	}

	function colocarDadoAtualTela()
	{
		document.getElementById("dado").innerHTML = nDadoAtual;
	}

	var strCasaAtual;
	function colocarDadosCasaAtualTela()
	{
		document.getElementById("informacoesPersCasa").innerHTML = this.tabuleiro.strPersonagemAtual() + "<br><br>" + strCasaAtual;
	}

	function colocarNotificacaoTela(notificacao)
	{
		var msg = "Você caiu em NOTIFICAÇÕES! Será sorte ou azar?\n\n"+
			notificacao.textoNotific + "\n";

		if(notificacao.qtdFelicidadeMuda != 0)
			msg += "\nFelicidade: " + Ajustar.IntegerComSinal(notificacao.qtdFelicidadeMuda) + "%";

		if(notificacao._qtdDinheiroMuda != 0)
			msg += "\nDinheiro: " + notificacao.getStrDinheiroQtdDinheiroMuda();

		alert(msg);
	}

	function colocarPersSaiuPrisaoTela()
	{
		alert("Você saiu da prisão! Na próxima rodada você pode jogar como um homem livre!");
	}

	function colocarPersDiminuiuTempoPrisaoTela()
	{
		alert("Você não conseguiu sair da prisão! Tente tirar 6 da próxima vez!\nRestam-se " + tabuleiro.getPersonagemAtual().getQtdRodadasFaltam()
			+ " rodadas para você sair sem independente do número que você tirar...");
	}

	function colocarOQueAconteceuPersTela(acoesCasaAtual)
	{
		//falar o que aconteceu com usuario, perdeu ou ganhou felicidade
		let msg = "";
		if(acoesCasaAtual.textoNotific != null)
			msg = acoesCasaAtual.textoNotific;
		if(acoesCasaAtual.qtdFelicidadeMuda != 0)
			msg += ((acoesCasaAtual.textoNotific != null) ? "\n\n" : "") +
				"Felicidade: " + Ajustar.IntegerComSinal(acoesCasaAtual.qtdFelicidadeMuda) + "%";
		if(acoesCasaAtual._qtdDinheiroMuda != 0)
		{
			if(acoesCasaAtual.textoNotific != null && acoesCasaAtual.qtdFelicidadeMuda == 0)
				msg += "\n\n";
			else
			if(acoesCasaAtual.qtdFelicidadeMuda != 0)
				msg += "\n";

			msg += "Dinheiro: " + acoesCasaAtual.getStrDinheiroQtdDinheiroMuda();
		}
		alert(msg);
	}

	function colocarButtons()
	{
		etapa++; //etapa = 3;

		document.getElementById("btnPassarJogada").style.visibility = "visible";

		let persConsegueComprarCasa = tabuleiro.personagemConsegueComprarCasa();
		if(persConsegueComprarCasa)
		{
			document.getElementById("btnComprarCasa").innerHTML = "<br>Comprar<br>" +
				"(" + tabuleiro.getPrecoCasaPersAtual() + ")";
			document.getElementById("btnComprarCasa").style.visibility = "visible";
		}

		if(tabuleiro.personagemPodeComprarFelicidade())
		{
			let btnComprarFelicidade = document.getElementById("btnComprarFelicidade");
			let lbComprarFelicidade = document.getElementById("lbComprarFelicidade");

			if(persConsegueComprarCasa)
			{
				//deixar no lugar normal
				btnComprarFelicidade.style.top = "309px";
				lbComprarFelicidade.style.top = "369.2px";
			}else
			{
				//deixar no lugar do btnComprarCasa
				btnComprarFelicidade.style.top = "225px";
				lbComprarFelicidade.style.top = "285.2px";
			}

			btnComprarFelicidade.style.visibility = "visible";
			lbComprarFelicidade.style.visibility = "visible";
		}
	}


	//DADO
	var nDadoAtual = -1;
	const tempoPorNumeroDado = 90;
	var firstClick = true;
	function comecarGirarDado()
	{
		firstClick = true;
		nDadoAtual = 1;
		document.getElementById("dado").style.visibility = "visible";
		document.getElementById("titleDado").style.visibility = "visible";
		etapa++; //etapa = 1;
	}

	function aumentarContagemDado()
	{
		if(etapa == 1)
		{
			nDadoAtual++;
			if(nDadoAtual > 6)
				nDadoAtual = 1;

			colocarDadoAtualTela();
		}
	}

	function clickCanvas()
	{
		if (etapa == 1 && firstClick) //se dado estah girando
		{
			firstClick = false; //continua girando o dado mas nao vai entrar aqui dnv
			document.getElementById("titleDado").style.visibility = "hidden";
			setTimeout(auxPararDado, 225);
		}
	}

	function auxPararDado()
	{
		etapa++; //etapa = 2;
		setTimeout(pararDado, 500); //dado fica parado no numero que tirou um tempo
	}

	function pararDado()
	{
		let nDado = 17;// nDadoAtual;
		nDadoAtual = -1;

		var result = tabuleiro.procPersGirouDado(nDado);
		/*
			result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu;
					1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
	  	result[1] //acoesCasaAtual (notificacao ou soh oq aconteceu com o personagem naquela casa)
	  	result[2] //string para mostrar ao usuario sobre casa atual
			result[3] //ehNotificacao (boolean)
			result[4] //(x,y) dos personagens
		*/

		colocarPeoesNaTela(result[4]);

		document.getElementById("dado").style.visibility = "hidden";

		//mostrar opcoes da casa em que caiu
		strCasaAtual = result[2];
		colocarDadosCasaAtualTela();

		var acoesCasaAtual = result[1];
		var resultadoExecucao = result[0];

		if(result[3])
		//se caiu em "notificacoes"
		{
			colocarNotificacaoTela(acoesCasaAtual);

			if(resultadoExecucao == -1)
			//personagem morreu (nunca vai ser 2 ou 1, pois nao estava na prisao)
				procPersMorreu();
		}else
		{
			switch(resultadoExecucao)
			{
				case 1:
					colocarPersSaiuPrisaoTela(); //falar que pers saiu da prisao
					break;
				case 2:
					colocarPersDiminuiuTempoPrisaoTela(); //falar que pers diminuiu prisao
					break;
				default:
				//daqui pra baixo eh 0 ou -1
					colocarOQueAconteceuPersTela(acoesCasaAtual);

					if(resultadoExecucao==-1)
						procPersMorreu();
					break;
			}

		}

		let indexGanhou = tabuleiro.indexPersonagemGanhou();
		if(indexGanhou < 0) //se ninguem ganhou continua o jogo
			colocarButtons();
		else
			procGanhou(indexGanhou);
	}

	function procPersMorreu()
	{
		document.getElementById("informacoesPersCasa").innerHTML = "<strike><b>Personagem " + tabuleiro.getIndexPersonagemAtual() + "</strike></b>" +
			"<br><br>" + strCasaAtual;
		alert("Você morreu!!\n\nTodos os seus bens serão devolvidos ao Estado e os outros jogadores poderão comprá-los...");
	}

	function procGanhou(indexGanhou)
	{
		alert("Personagem " + (indexGanhou + 1) + " ganhou o incrível Banco Imobiliário COTUCA!! Parabéns!");
		document.location.reload(true);
	}


	//BUTTONS
	function passarJogada()
	{
		if(etapa == 3)
		{
			tabuleiro.proximoPersonagem();

			document.getElementById("btnPassarJogada").style.visibility = "hidden";
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
			document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
			document.getElementById("btnComprarCasa").style.visibility = "hidden";

			colocarRodadaNaTela();
		}else
			document.getElementById("btnPassarJogada").style.visibility = "hidden";
	}

	function comprarFelicidade()
	{
		var pers = tabuleiro.getPersonagemAtual();
		if(etapa == 3 && tabuleiro.personagemPodeComprarFelicidade())
		{
			tabuleiro.persComprarFelicidade();

			//coloca na tela os valores diferentes do personagem
			colocarDadosCasaAtualTela();

			alert("Você comprou 20% de felicidade! A sua felicidade está com " + pers.felicidade + "%");

			//se acabou o dinheiro ou felicidade = 100%, botao desaparece
			if(!tabuleiro.personagemPodeComprarFelicidade())
			{
				document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
				document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
			}
		}else
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
	}

	function comprarCasa()
	{
		if(etapa == 3 && tabuleiro.personagemConsegueComprarCasa())
		{
			var nome = tabuleiro.persComprarCasa();

			//coloca na tela os valores diferentes do personagem
			colocarDadosCasaAtualTela();

			alert("Você comprou " + nome + "!");
		}

		document.getElementById("btnComprarCasa").style.visibility = "hidden";
	}


	//classe pra ajudar
	class Ajustar
	{
		static IntegerComSinal(n)
		{
			if(n > 0)
			    return "+" + n;
			else
			    return n.toString();
  		}

  		static FloatToMoney(n)
  		{
  			return Math.floor(Math.abs(n) * 100) * (n < 0 ? -1 : 1) / 100;
  		}
	}
