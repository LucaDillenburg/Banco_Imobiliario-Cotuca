	var tabuleiro;

	var etapa = 0;
	//0: esperando pra colocar dado girando
	//1: dado girando
	//2: mostrando informacoes casa
	//3: pode comprar casa, alegria ou passar vez

	//INICIO
	function iniciar()
	{
		objCanvas   = document.getElementById("meuCanvas");
		objContexto = objCanvas.getContext("2d");
		
		this.tabuleiro = new Tabuleiro(4);
		
		/*
		var a = 5;
		var b = 10.0;
		var c = 7.00;
		var d = 5.5;
		var e = 5.50;
		var f = 5.25;
		var g = 5.256;
		alert(a.toFixed(2) + ", " + b.toFixed(2) + ", " + c.toFixed(2) + ", " + d.toFixed(2) + ", " +
			e.toFixed(2) + ", " + f.toFixed(2) + ", " + g.toFixed(2)); 
		*/

		this.colocarRodadaNaTela();
		this.setInterval(this.aumentarContagemDado, 100);//tempoPorNumeroDado);
	}


	//TELA
	function colocarRodadaNaTela()
	{
		this.etapa = 0;

		//aqui
		//colocar na tela: informacoes do usuario que vai jogar (usar canvas)
		this.tabuleiro._teste();

		//girar o dado depois de um tempo
		setTimeout(this.comecarGirarDado, 500);
	}

	function colocarDadoAtualTela()
	{
		document.getElementById("dado").innerHTML = this.nDadoAtual;
	}

	function colocarDadosCasaAtualTela(strCasaAtual)
	{
		//aqui (usar canvas)
		alert(strCasaAtual);
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
		alert("Você não conseguiu sair da prisão! Tente tirar 6 da próxima vez!\nRestam-se " + this.tabuleiro.getPersonagemAtual().getQtdRodadasFaltam()
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
		this.etapa++; //this.etapa = 3;

		document.getElementById("btnPassarJogada").style.visibility = "visible";
		
		if(this.tabuleiro.personagemPodeComprarFelicidade())
		{
			document.getElementById("btnComprarFelicidade").style.visibility = "visible";
			document.getElementById("lbComprarFelicidade").style.visibility = "visibility";
		}
		
		if(this.tabuleiro.personagemConsegueComprarCasa())
			document.getElementById("btnComprarCasa").style.visibility = "visible";
	}


	//DADO
	var nDadoAtual = -1;
	const tempoPorNumeroDado = 90;
	var firstClick = true;
	function comecarGirarDado()
	{
		this.firstClick = true;
		this.nDadoAtual = 1;
		document.getElementById("dado").style.visibility = "visible";
		document.getElementById("titleDado").style.visibility = "visible";
		this.etapa++; //this.etapa = 1;
	}

	function aumentarContagemDado()
	{
		if(this.etapa == 1)
		{
			this.nDadoAtual++;
			if(this.nDadoAtual > 6)
				this.nDadoAtual = 1;

			this.colocarDadoAtualTela();
		}
	}

	function clickCanvas()
	{
		if (this.etapa == 1 && this.firstClick) //se dado estah girando
		{
			this.firstClick = false; //continua girando o dado mas nao vai entrar aqui dnv
			document.getElementById("titleDado").style.visibility = "hidden";
			setTimeout(this.auxPararDado, 225);
		}
	}

	function auxPararDado()
	{
		this.etapa++; //this.etapa = 2;
		setTimeout(this.pararDado, 500); //dado fica parado no numero que tirou um tempo
	}

	function pararDado()
	{
		let nDado = this.nDadoAtual;
		this.nDadoAtual = -1;

		var result = this.tabuleiro.procPersGirouDado(nDado);
		/*
		result[0] //resultado da execucao (0: execucao normal; -1: personagem morreu; 
					1: personagem saiu da prisao; 2: personagem teve prisao diminuida)
	    result[1] //acoesCasaAtual (notificacao ou soh oq aconteceu com o personagem naquela casa)
	    result[2] //string para mostrar ao usuario sobre casa atual
		result[3] //ehNotificacao (boolean)
		*/

		document.getElementById("dado").style.visibility = "hidden";

		//mostrar opcoes da casa em que caiu
		var strCasaAtual = result[2];
		this.colocarDadosCasaAtualTela(strCasaAtual);

		var acoesCasaAtual = result[1];
		var resultadoExecucao = result[0];

		if(result[3])
		//se caiu em "notificacoes"
		{
			this.colocarNotificacaoTela(acoesCasaAtual);

			if(resultadoExecucao == -1)
			//personagem morreu (nunca vai ser 2 ou 1, pois nao estava na prisao)
				this.procPersMorreu();
		}else
		{
			switch(resultadoExecucao)
			{
				case 1:
					this.colocarPersSaiuPrisaoTela(); //falar que pers saiu da prisao
					break;
				case 2:
					this.colocarPersDiminuiuTempoPrisaoTela(); //falar que pers diminuiu prisao
					break;
				default: 
				//daqui pra baixo eh 0 ou -1
					this.colocarOQueAconteceuPersTela(acoesCasaAtual);

					if(resultadoExecucao==-1)
						this.procPersMorreu();
					break;
			}

		}

		this.colocarButtons();
	}
	
	function procPersMorreu()
	{
		alert("Você morreu!");
		//aqui
		//decidir o que vai fazer com as posses do morto (hipotecar uma por uma ateh ficar com dinheiro positivo dnv? simplesmente perder todas as propriedades)
	}


	//BUTTONS
	function passarJogada()
	{
		if(this.etapa == 3)
		{
			this.tabuleiro.proximoPersonagem();

			document.getElementById("btnPassarJogada").style.visibility = "hidden";
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
			document.getElementById("lbComprarFelicidade").style.visibility = "hidden";
			document.getElementById("btnComprarCasa").style.visibility = "hidden";

			this.colocarRodadaNaTela();
		}else
			document.getElementById("btnPassarJogada").style.visibility = "hidden";
	}

	function comprarFelicidade()
	{
		var pers = this.tabuleiro.getPersonagemAtual();
		if(this.etapa == 3 && this.tabuleiro.personagemPodeComprarFelicidade())
		{
			this.tabuleiro.persComprarFelicidade();
			alert("Você comprou 20% de felicidade! A sua felicidade está com " + pers.felicidade + "%");
		}else
			document.getElementById("btnComprarFelicidade").style.visibility = "hidden";
	}

	function comprarCasa()
	{
		if(this.etapa == 3 && this.tabuleiro.personagemConsegueComprarCasa())
		{
			var nome = this.tabuleiro.persComprarCasa();
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