	var tabuleiro;

	var etapa = 0;
	//0: esperando pra colocar dado girando
	//1: dado girando
	//2: mostrando informacoes terreno
	//3: pode comprar terreno, alegria ou passar vez

	//output
	var objContexto;

	//INICIO
	function iniciar()
	{
		objContexto = document.getElementById("meuCanvas").getContext("2d");

		let qtdPers = getQtdPersonagens();
		let qtdNBots = getNBots(qtdPers);

		tabuleiro = new Tabuleiro(qtdPers, qtdPers + qtdNBots);
		setTimeout(comecarJogo, 200);
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
		colocarPeoesECasinhasNaTela(true);
		colocarRodadaNaTela();
		setInterval(aumentarContagemDado, 70);
	}

	//TELA
	function colocarRodadaNaTela()
	{
		etapa = 0;

		//colocar na tela: informacoes do usuario que vai jogar
		document.getElementById("informacoesPersTerreno").innerHTML = tabuleiro.strPersonagemAtual();
		colocarStrTodosPersTela();

		//girar o dado depois de um tempo
		setTimeout(comecarGirarDado, 500);
	}

	function colocarPeoesECasinhasNaTela(first = false)
	{
		//tabuleiro (fundo)
		objContexto.drawImage(tabuleiro.imgFundo, 0, 0, 1088, 624); //300 -> 1088, 150 -> 624

		//personagens/peoes
		let vetorXYPers = tabuleiro.vetorLocationPersonagens();
		for(let i = vetorXYPers.length-1; i >= 0; i--)
		{
			let index = (tabuleiro.getIndexPersonagemAtual() - (first?1:0) + i) % vetorXYPers.length;
			if(vetorXYPers[index] != null)
				objContexto.drawImage(vetorXYPers[index].imgPeao, vetorXYPers[index].x, vetorXYPers[index].y, 50, 75);
		}

		//casinhas (o que compra quando tem toda uma rua)
		let vetorXYCasinhas = tabuleiro.vetorLocationCasinhas();
		for(let i = 0; i<vetorXYCasinhas.length; i++)
			if(vetorXYCasinhas[i] != null)
				objContexto.drawImage(tabuleiro.imgCasinha, vetorXYCasinhas[i].x, vetorXYCasinhas[i].y, 50, 40);
	}

	function colocarDadoAtualTela()
	{
		document.getElementById("lbDado").innerHTML = nDadoAtual;
	}

	var strTerrenoAtual;
	function colocarDadosTerrenoAtualTela()
	{
		document.getElementById("informacoesPersTerreno").innerHTML = tabuleiro.strPersonagemAtual() + "<br><br>" + strTerrenoAtual;
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
		let msg = "Você não conseguiu sair da prisão! Tente tirar 6 da próxima vez!\n";
		let rodadasFaltam = tabuleiro.getPersonagemAtual().getQtdRodadasFaltam();
		if(rodadasFaltam == 0)
			msg += "Na próxima rodada você será um homem livre!";
		else
			msg += "Restam-se " + rodadasFaltam + " rodadas para você sair sem independente do número que você tirar...";
		alert(mudarMsgParaBotSePrecisar(msg));
	}

	function colocarOQueAconteceuPersTela(acoesTerrenoAtual)
	{
		//falar o que aconteceu com usuario, perdeu ou ganhou felicidade
		let msg = "";
		if(acoesTerrenoAtual.textoNotific != null)
			msg = acoesTerrenoAtual.textoNotific;

		if(acoesTerrenoAtual.qtdFelicidadeMuda != 0)
		{
			msg += ((acoesTerrenoAtual.textoNotific != null) ? "\n\n" : "");
			if(acoesTerrenoAtual.qtdFelicidadeMuda == 100)
				msg += "Felicidade = 100%";
			else
				msg += "Felicidade: " + Ajustar.IntegerComSinal(acoesTerrenoAtual.qtdFelicidadeMuda) + "%";
		}

		if(acoesTerrenoAtual._qtdDinheiroMuda != 0)
		{
			if(acoesTerrenoAtual.textoNotific != null && acoesTerrenoAtual.qtdFelicidadeMuda == 0)
				msg += "\n\n";
			else
			if(acoesTerrenoAtual.qtdFelicidadeMuda != 0)
				msg += "\n";

			msg += "Dinheiro: " + acoesTerrenoAtual.getStrDinheiroQtdDinheiroMuda();
		}

		alert(mudarMsgParaBotSePrecisar(msg));
	}

	function mudarMsgParaBotSePrecisar(msg)
	{
		return msg;

		if(tabuleiro.persEhBot())
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

		document.getElementById("btnPassarJogada").style.display = "inline-block";

		if(tabuleiro.persPodeComprarTerreno())
		{
			document.getElementById("btnComprarTerreno").innerHTML = "Comprar<br>" +
				"(" + tabuleiro.getPrecoTerrenoPersAtual() + ")";
			document.getElementById("btnComprarTerreno").style.display = "inline-block";
		}else
		if (tabuleiro.persPodeComprarCasinha())
		{
			document.getElementById("btnComprarCasinha").style.display = "inline-block";
			document.getElementById("lbComprarCasinha").style.display = "inline-block";
		}

		if(tabuleiro.persPodeComprarFelicidade())
		{
			document.getElementById("btnComprarFelicidade").style.display = "inline-block";
			document.getElementById("lbComprarFelicidade").style.display = "inline-block";
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

		document.getElementById("divOpacidade").style.visibility = "visible";

		if (tabuleiro.persEhBot())
			document.getElementById("titleDadoBot").style.visibility = "visible";
		else
			document.getElementById("titleDado").style.visibility = "visible";
		etapa++; //etapa = 1;

		if (tabuleiro.persEhBot())
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
		if (etapa == 1 && firstClick && !tabuleiro.persEhBot()) //se dado estah girando
			auxClickCanvas();
	}

	function auxClickCanvas()
	{
		firstClick = false; //continua girando o dado mas nao vai entrar aqui dnv

		if (tabuleiro.persEhBot())
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
	  	result[1] //acoesTerrenoAtual (notificacao ou soh oq aconteceu com o personagem naquele terreno)
			result[2] //ehNotificacao (boolean)
			result[3] //str deu volta
		*/

		colocarPeoesECasinhasNaTela();

		document.getElementById("dado").style.visibility = "hidden";
		document.getElementById("divOpacidade").style.visibility = "hidden";

		//mostrar opcoes do terreno em que caiu
		strTerrenoAtual = tabuleiro.strTerrenoParaUsuario();
		colocarDadosTerrenoAtualTela();

		var acoesTerrenoAtual = result[1];
		var resultadoExecucao = result[0];

		if(result[3] != null && result[3] != "")
			alert(result[3]);

		if(result[2])
		//se caiu em "notificacoes"
		{
			colocarNotificacaoTela(acoesTerrenoAtual);

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
					colocarOQueAconteceuPersTela(acoesTerrenoAtual);

					if(resultadoExecucao==-1)
						procPersMorreu();
					break;
			}

		}

		let indexGanhou = tabuleiro.indexPersonagemGanhou();
		if(indexGanhou < 0) //se ninguem ganhou continua o jogo
		{
			if(!tabuleiro.persEhBot())
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
		if(tabuleiro.persDeveComprarFelicidade())
			comprarFelicidade();

		//ver se bot vai comprar terreno
		while(true)
		{
			let indexComprarTerrenoOuCasa = tabuleiro.persDeveComprarTerrenoOuCasinha();
			if (indexComprarTerrenoOuCasa <= 0)
				break;

			if (indexComprarTerrenoOuCasa == 1)
				comprarTerreno();
			else
				if (indexComprarTerrenoOuCasa == 2)
					comprarCasinha();
		}
		
		//passar jogada
		passarJogada();
	}

	function procPersMorreu()
	{
		colocarDadosTerrenoAtualTela();
		alert(mudarMsgParaBotSePrecisar("Você morreu!!\n\nTodos os seus bens serão devolvidos ao Estado e os outros jogadores poderão comprá-los..."));
	}

	function procGanhou(indexGanhou)
	{
		alert("Personagem " + (indexGanhou + 1) + " ganhou o incrível Banco Imobiliário COTUCA!! Parabéns!");
		window.location = "index.html"; //document.location.reload(true);
	}


	//BUTTONS
	//passar jogada
	function btnPassarJogada_Click()
	{
		if(etapa == 3 && !tabuleiro.persEhBot())
			passarJogada();
		else
		{
			alert("u idiot!");
			document.getElementById("btnPassarJogada").style.display = "inline-block";
		}
	}

	function passarJogada()
	{
		tabuleiro.proximoPersonagem();

		document.getElementById("btnPassarJogada").style.display = "none";
		document.getElementById("btnComprarTerreno").style.display = "none";
		document.getElementById("btnComprarCasinha").style.display = "none";
		document.getElementById("lbComprarCasinha").style.display = "none";
		document.getElementById("btnComprarFelicidade").style.display = "none";
		document.getElementById("lbComprarFelicidade").style.display = "none";
		
		colocarRodadaNaTela();
	}

	//comprar terreno
	function btnComprarTerreno_Click()
	{
		if(etapa == 3 && !tabuleiro.persEhBot() && tabuleiro.persPodeComprarTerreno())
			comprarTerreno();
		else
		{
			alert("u idiot!");
			document.getElementById("btnComprarTerreno").style.display = "none";
		}
	}

	function comprarTerreno()
	{
		var nome = tabuleiro.persComprarTerreno();

		//coloca na tela os valores diferentes do personagem
		colocarDadosTerrenoAtualTela();

		alert(mudarMsgParaBotSePrecisar("Você comprou " + nome + "!"));

		//ajustar botoes (quais devem ficar visiveis e quais nao):
		//btnComprarTerreno
		document.getElementById("btnComprarTerreno").style.display = "none";
		//se btnComprarCasinha pode aparecer na tela
		if (tabuleiro.persPodeComprarCasinha())
		{
			document.getElementById("btnComprarCasinha").style.display = "inline-block";
			document.getElementById("lbComprarCasinha").style.display = "inline-block";
		}
		//se btnComprarFelicidade esta aparecendo na tela
		if(document.getElementById("btnComprarFelicidade").style.display != "none")
		{
			if(!tabuleiro.persPodeComprarFelicidade())
			{
				//deixar no lugar do btnComprarTerreno
				document.getElementById("btnComprarFelicidade").style.display = "none";
				document.getElementById("lbComprarFelicidade").style.display = "none";
			}
		}
	}

	//comprar Casinha
	function btnComprarCasinha_Click()
	{
		if(etapa == 3 && !tabuleiro.persEhBot() && tabuleiro.persPodeComprarCasinha())
			comprarCasinha();
		else
		{
			alert("u idiot!");
			document.getElementById("btnComprarCasinha").style.display = "none";
		}
	}

	function comprarCasinha()
	{
		let result = tabuleiro.persComprarCasinha();
		let nomeTerreno = result[0];
		let novoAluguel = result[1];

		//coloca o tabuleiro de novo na tela (pois ha uma casinha nova)
		colocarPeoesECasinhasNaTela();
		//coloca na tela os valores diferentes do personagem
		colocarDadosTerrenoAtualTela();

		alert(mudarMsgParaBotSePrecisar("Você comprou uma casinha em " + nomeTerreno + "! Agora o aluguel para quem cair nesse terreno é de " + novoAluguel + "!"));

		//se acabou o dinheiro ou jah esta no numero maximo de casinhas, botao desaparece
		if(!tabuleiro.persPodeComprarCasinha())
		{
			document.getElementById("btnComprarCasinha").style.display = "none";
			document.getElementById("lbComprarCasinha").style.display = "none";
		}

		//display do btnComprarTerreno (se podia comprar mas agora nao pode mais por falta de dinheiro)
		//e do btnComprarCasinha:

		//se btnComprarFelicidade estava na tela e mas agora nao ha mais dinheiro
		if(document.getElementById("btnComprarFelicidade").style.display != "none" || !tabuleiro.persPodeComprarFelicidade())
		{
			document.getElementById("btnComprarCasinha").style.display = "inline-block";
			document.getElementById("lbComprarCasinha").style.display = "inline-block";
		}
	}

	//comprar felicidade
	function btnComprarFelicidade_Click()
	{
		var pers = tabuleiro.getPersonagemAtual();
		if(etapa == 3 && !tabuleiro.persEhBot() && tabuleiro.persPodeComprarFelicidade())
			comprarFelicidade();
		else
		{
			alert("u idiot!");
			document.getElementById("btnComprarFelicidade").style.display = "none";
		}
	}

	function comprarFelicidade()
	{
		tabuleiro.persComprarFelicidade();

		//coloca na tela os valores diferentes do personagem
		colocarDadosTerrenoAtualTela();

		alert(mudarMsgParaBotSePrecisar("Você comprou 20% de felicidade! A sua felicidade está com " + tabuleiro.getFelicidadePersAtual()));

		//se acabou o dinheiro ou felicidade = 100%, botao desaparece
		if(!tabuleiro.persPodeComprarFelicidade())
		{
			document.getElementById("btnComprarFelicidade").style.display = "none";
			document.getElementById("lbComprarFelicidade").style.display = "none";
		}

		//display do btnComprarTerreno (se podia comprar mas agora nao pode mais por falta de dinheiro)
		//e do btnComprarCasinha:

		//se btnComprarTerreno estava na tela mas agora nao ha mais dinheiro para tal
		if(document.getElementById("btnComprarTerreno").style.display != "none")
		{
			if(!tabuleiro.persPodeComprarTerreno())
				document.getElementById("btnComprarTerreno").style.display = "none";
		}else
			//se btnComprarCasinha estava na tela mas agora nao ha mais dinheiro para tal
			if(document.getElementById("btnComprarCasinha").style.display != "none" && !tabuleiro.persPodeComprarCasinha())
			{
				document.getElementById("btnComprarCasinha").style.display = "none";
				document.getElementById("lbComprarCasinha").style.display = "none";
			}
	}
