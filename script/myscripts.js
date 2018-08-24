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

		let qtdPers = getQtdPersonagens();
		let qtdNBots = getNBots(qtdPers);

		tabuleiro = new Tabuleiro(qtdPers, qtdPers + qtdNBots);
		imgPeoesPers = new Array(qtdPers + qtdNBots);
		for (var i = 0; i < imgPeoesPers.length; i++)
		{
			imgPeoesPers[i] = new Image();

			if(i == qtdPers + qtdNBots -1)
				imgPeoesPers[qtdPers + qtdNBots -1].onload = function()
				{
					comecarJogo();
				}

			imgPeoesPers[i].src = "img/peao" + (i + 1) + ".png";
		}
	}

	function getQtdPersonagens()
	{
		try
		{
			var loc = location.search;
			var indexNJogadores = loc.indexOf("?nJogadores=");
			if(indexNJogadores < 0)
				throw "";
			var indexNBot = loc.indexOf("&nBots=", indexNJogadores + 13);
			if(indexNBot < 0)
				throw "";
			var ret = parseInt(loc.substring(indexNJogadores + 12, indexNBot));

			if(ret < 1 || ret > 5)
				throw "";
		}catch(err)
		{
			window.location = "index.html";
		}
		
		return ret;
	}

	function getNBots(qtdPers)
	{
		try
		{
			var loc = location.search;
			var ret = parseInt(loc.substring(loc.indexOf("&nBots=") + 7, loc.length));

			if(ret < 0 || ret + qtdPers > 5)
				throw "";
		}catch(err)
		{
			window.location = "index.html";
		}
		
		return ret;
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
		document.getElementById("informacoesPersCasa").innerHTML = tabuleiro.strPersonagemAtual();
		colocarStrTodosPersTela();

		//girar o dado depois de um tempo
		setTimeout(comecarGirarDado, 500);
	}

	function colocarPeoesNaTela(vetorXYPers)
	{
		objContexto.drawImage(imgFundo, 0, 0, 1088, 624); //300 -> 1088, 150 -> 624
		for(let i = 0; i<vetorXYPers.length; i++)
			if(vetorXYPers[i] != null)
				objContexto.drawImage(imgPeoesPers[i], vetorXYPers[i].x, vetorXYPers[i].y, 54.4, 62.4);
	}

	function colocarDadoAtualTela()
	{
		document.getElementById("lbDado").innerHTML = nDadoAtual;
	}

	var strCasaAtual;
	function colocarDadosCasaAtualTela()
	{
		document.getElementById("informacoesPersCasa").innerHTML = tabuleiro.strPersonagemAtual() + "<br><br>" + strCasaAtual;
		colocarStrTodosPersTela();
	}

	function colocarStrTodosPersTela()
	{
		var lbInfoTodosPers = document.getElementById("lbInfoTodosPers");
		lbInfoTodosPers.innerHTML = tabuleiro.strTodosPersonagens();
		lbInfoTodosPers.style.top = (760 - lbInfoTodosPers.offsetHeight) + "px";
	}

	function colocarNotificacaoTela(notificacao)
	{
		var msg = "Você caiu em NOTIFICAÇÕES! Será sorte ou azar?\n\n"+
			notificacao.textoNotific + "\n";

		if(notificacao.qtdFelicidadeMuda != 0)
			msg += "\nFelicidade: " + Ajustar.IntegerComSinal(notificacao.qtdFelicidadeMuda) + "%";

		if(notificacao._qtdDinheiroMuda != 0)
			msg += "\nDinheiro: " + notificacao.getStrDinheiroQtdDinheiroMuda();

		alert(mudarMsgParaBotSePrecisar(msg));
	}

	function colocarPersSaiuPrisaoTela()
	{
		alert(mudarMsgParaBotSePrecisar("Você saiu da prisão! Na próxima rodada você pode jogar como um homem livre!"));
	}

	function colocarPersDiminuiuTempoPrisaoTela()
	{
		alert(mudarMsgParaBotSePrecisar("Você não conseguiu sair da prisão! Tente tirar 6 da próxima vez!\nRestam-se " + tabuleiro.getPersonagemAtual().getQtdRodadasFaltam()
			+ " rodadas para você sair sem independente do número que você tirar..."));
	}

	function colocarOQueAconteceuPersTela(acoesCasaAtual)
	{
		//falar o que aconteceu com usuario, perdeu ou ganhou felicidade
		let msg = "";
		if(acoesCasaAtual.textoNotific != null)
			msg = acoesCasaAtual.textoNotific;

		if(acoesCasaAtual.qtdFelicidadeMuda != 0)
		{
			msg += ((acoesCasaAtual.textoNotific != null) ? "\n\n" : "");
			if(acoesCasaAtual.qtdFelicidadeMuda == 100)
				msg += "Felicidade = 100%";
			else
				msg += "Felicidade: " + Ajustar.IntegerComSinal(acoesCasaAtual.qtdFelicidadeMuda) + "%";
		}

		if(acoesCasaAtual._qtdDinheiroMuda != 0)
		{
			if(acoesCasaAtual.textoNotific != null && acoesCasaAtual.qtdFelicidadeMuda == 0)
				msg += "\n\n";
			else
			if(acoesCasaAtual.qtdFelicidadeMuda != 0)
				msg += "\n";

			msg += "Dinheiro: " + acoesCasaAtual.getStrDinheiroQtdDinheiroMuda();
		}

		alert(mudarMsgParaBotSePrecisar(msg));
	}

	function mudarMsgParaBotSePrecisar(msg)
	{
		return msg;

		if(tabuleiro.persAtualEhBot())
		{
			msg = msg.replaceAll("você", "Personagem " + tabuleiro.getIndexPersonagemAtual());
			msg = msg.replaceAll("Você", "Personagem " + tabuleiro.getIndexPersonagemAtual());
			msg = msg.replaceAll("sua", "seu");
			msg = msg.replaceAll("Sua", "Seu");
			//trocar sua/seu/suas/seus por dele/dele/deles/deles
			/*let index = 0;
			while(index >= 0)
			{
				let auxIndexSeu = msg.indexOf("seu", index);
				if(auxIndexSeu < 0)
					auxIndexSeu = msg.length;
				let auxIndexSua = msg.indexOf("sua", index);
				if(auxIndexSua < 0)
					auxIndexSua = msg.length;

				if (auxIndexSeu >= msg.length - 3 && 
					auxIndexSua >= msg.length - 3)
					break;

				if (auxIndexSeu < auxIndexSua)
					index = auxIndexSeu;
				else
					index = auxIndexSua;

				//"ola esse eh seu" ou "esse eh seu nome"
			}*/
		}

		return msg;
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
				btnElbFelicidadeEmCima();

			btnComprarFelicidade.style.visibility = "visible";
			lbComprarFelicidade.style.visibility = "visible";
		}
	}

	function btnElbFelicidadeEmCima()
	{
		//deixar no lugar do btnComprarCasa
		document.getElementById("btnComprarFelicidade").style.top = "225px";
		document.getElementById("lbComprarFelicidade").style.top = "285.2px";
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

		document.getElementById("divOpacidade").style.visibility = "visible";

		if (tabuleiro.persAtualEhBot())
			document.getElementById("titleDadoBot").style.visibility = "visible";
		else
			document.getElementById("titleDado").style.visibility = "visible";
		etapa++; //etapa = 1;

		if (tabuleiro.persAtualEhBot())
			setTimeout(auxClickCanvas, Math.floor(Math.random()*1500) + 300);
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
		if (etapa == 1 && firstClick && !tabuleiro.persAtualEhBot()) //se dado estah girando
			auxClickCanvas();
	}

	function auxClickCanvas()
	{
		firstClick = false; //continua girando o dado mas nao vai entrar aqui dnv

		if (tabuleiro.persAtualEhBot())
			document.getElementById("titleDadoBot").style.visibility = "hidden";
		else
			document.getElementById("titleDado").style.visibility = "hidden";

		setTimeout(auxPararDado, Math.floor(Math.random()*200) + 150);
	}

	function auxPararDado()
	{
		etapa++; //etapa = 2;
		setTimeout(pararDado, 500); //dado fica parado no numero que tirou um tempo
	}

	function pararDado()
	{
		let nDado = nDadoAtual;
		nDadoAtual = -1;

		var result = tabuleiro.procPersGirouDado(nDado);
		/*
			result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu;
					1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
	  	result[1] //acoesCasaAtual (notificacao ou soh oq aconteceu com o personagem naquela casa)
			result[2] //ehNotificacao (boolean)
			result[3] //str deu volta
		*/

		colocarPeoesNaTela(tabuleiro.vetorLocationPersonagens());

		document.getElementById("dado").style.visibility = "hidden";
		document.getElementById("divOpacidade").style.visibility = "hidden";

		//mostrar opcoes da casa em que caiu
		strCasaAtual = tabuleiro.strCasaParaUsuario();
		colocarDadosCasaAtualTela();

		var acoesCasaAtual = result[1];
		var resultadoExecucao = result[0];

		if(result[3] != null && result[3] != "")
			alert(result[3]);

		if(result[2])
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
		{
			if(!tabuleiro.persAtualEhBot())
				colocarButtons();
			else
				setTimeout(jogarBot, 500);
		}
		else
			procGanhou(indexGanhou);
	}

	function jogarBot()
	{
		//ver se bot vai comprar felicidade
		if(tabuleiro.persAtualDeveComprarFelicidade())
			comprarFelicidade();
		//ver se bot vai comprar casa
		if(tabuleiro.persAtualDeveComprarCasa())
			comprarCasa();
		//passar jogada
		passarJogada();
	}

	function procPersMorreu()
	{
		colocarDadosCasaAtualTela();
		alert(mudarMsgParaBotSePrecisar("Você morreu!!\n\nTodos os seus bens serão devolvidos ao Estado e os outros jogadores poderão comprá-los..."));
	}

	function procGanhou(indexGanhou)
	{
		alert("Personagem " + (indexGanhou + 1) + " ganhou o incrível Banco Imobiliário COTUCA!! Parabéns!");
		document.location.reload(true);
	}


	//BUTTONS
	//passar jogada
	function btnPassarJogada_Click()
	{
		if(etapa == 3 && !tabuleiro.persAtualEhBot())
			passarJogada();
		else
		{
			alert("u idiot!");
			document.getElementById("btnPassarJogada").style.visibility = "hidden";
		}
	}

	function passarJogada()
	{
		tabuleiro.proximoPersonagem();

		document.getElementById("btnPassarJogada").style.visibility = "hidden";
		document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
		document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
		document.getElementById("btnComprarCasa").style.visibility = "hidden";

		colocarRodadaNaTela();
	}

	//comprar casa
	function btnComprarCasa_Click()
	{
		if(etapa == 3 && !tabuleiro.persAtualEhBot() && tabuleiro.personagemConsegueComprarCasa())
			comprarCasa();
		else
		{
			alert("u idiot!");
			ajustarBtnsComprarCasa(false);
		}
	}

	function comprarCasa()
	{
		var nome = tabuleiro.persComprarCasa();

		//coloca na tela os valores diferentes do personagem
		colocarDadosCasaAtualTela();

		alert(mudarMsgParaBotSePrecisar("Você comprou " + nome + "!"));

		ajustarBtnsComprarCasa(true);
	}

	function ajustarBtnsComprarCasa(comprou)
	{
		document.getElementById("btnComprarCasa").style.visibility = "hidden";

		if(document.getElementById("btnComprarFelicidade").style.visibility == "visible")
		{
			if(!comprou || tabuleiro.personagemPodeComprarFelicidade())
				btnElbFelicidadeEmCima();
			else
			{
				//deixar no lugar do btnComprarCasa
				document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
				document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
			}
		}
	}

	//comprar felicidade
	function btnComprarFelicidade_Click()
	{
		var pers = tabuleiro.getPersonagemAtual();
		if(etapa == 3 && !tabuleiro.persAtualEhBot() && tabuleiro.personagemPodeComprarFelicidade())
			comprarFelicidade();
		else
		{
			alert("u idiot!");
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
		}
	}

	function comprarFelicidade()
	{
		tabuleiro.persComprarFelicidade();

		//coloca na tela os valores diferentes do personagem
		colocarDadosCasaAtualTela();

		alert(mudarMsgParaBotSePrecisar("Você comprou 20% de felicidade! A sua felicidade está com " + tabuleiro.getFelicidadePersAtual()));

		//se acabou o dinheiro ou felicidade = 100%, botao desaparece
		if(!tabuleiro.personagemPodeComprarFelicidade())
		{
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
			document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
		}
		//visibility of btnComprar casa (se podia comprar mas agora nao pode mais)
		if(document.getElementById("btnComprarCasa").style.visibility == "visible" && 
			!tabuleiro.personagemConsegueComprarCasa())
		{
			document.getElementById("btnComprarCasa").style.visibility = "hidden";
			btnElbFelicidadeEmCima();
		}
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
