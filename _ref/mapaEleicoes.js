// monta a coluna lateral dos presidentes
window.onload = function(){
	var presidentes = "http://apuracao-eleicoes2014.r7.com/143/1/br?page=1&items=3&callback=eleicoes2014_tempo_real"
	var totalVotos;
	var presidente = document.getElementById('presidente');

	$.ajax({
		url:presidentes,
		cache: true,
		dataType: 'jsonp', 
    	jsonpCallback: 'eleicoes2014_geral',
		success:function(data){
			totalVotos = data.partial.votosTotalizados;
			var tColor;
			var arrItensApuracao = [
				{_eleito:'eleito1', _apuracaoVotos:'apuracaoCandidato1', _percentual:'pontosCandidato1', _rodaPercent:'percentCandidato1', _foto:"fotoCandidato1", _nome:"nomeCandidato1"},
				{_eleito:'eleito2', _apuracaoVotos:'apuracaoCandidato2', _percentual:'pontosCandidato2', _rodaPercent:'percentCandidato2', _foto:"fotoCandidato2", _nome:"nomeCandidato2"},
				{_eleito:'eleito3', _apuracaoVotos:'apuracaoCandidato3', _percentual:'pontosCandidato3', _rodaPercent:'percentCandidato3', _foto:"fotoCandidato3", _nome:"nomeCandidato3"}
			];

			var apuracao = document.getElementById('apuracao');
            var apuracao2 = document.getElementById('apuracao2');
            apuracao.onmouseover = apuracao2.onmouseover = function(){
                TweenLite.to(this, .3, {css:{alpha:0.5}})
            }
            apuracao.onmouseout = apuracao2.onmouseout = function(){
                TweenLite.to(this, .3, {css:{alpha:1}})
            }

			for(var i =0, lim = data.candidates.length; i < lim; i++){
				var apuracaoVotos = document.getElementById(arrItensApuracao[i]._apuracaoVotos);
				var percentualVotos =document.getElementById(arrItensApuracao[i]._percentual);
				var conta = (data.candidates[i].totalVotos / data.partial.votosValidos) * 100
				conta = conta.toFixed(2).replace('.', ',');
				var nomeCandidato = document.getElementById(arrItensApuracao[i]._nome)
				var foto = document.getElementById(arrItensApuracao[i]._foto);
				var eleito = document.getElementById(arrItensApuracao[i]._eleito)

				var segundoTurno = data.candidates[i].eleito;

				foto.innerHTML = '<img src="http://sc.r7.com/eleicoes-2014/fotos/BR_1_'+data.candidates[i].numero+'.jpg"  width="45" alt="" />'
				
				nomeCandidato.innerHTML = data.candidates[i].nomeUrna+ '&nbsp;&nbsp;&nbsp;<span class="partido">'+data.candidates[i].partido+'</span>'
				if(data.candidates[i].totalVotos != 0){
					percentualVotos.innerHTML = conta + "%"
					apuracaoVotos.innerHTML = 'Votos ' + data.candidates[i].totalVotos;
					//Muda as cores da barra lateral de candidatos
					switch(data.candidates[i].partido){
						
						case 'PT':
							tColor = '#ed3e31'
						break;
						case 'PSDB':
							tColor = '#3780bf'
						break;
						case 'DEM':
							tColor = '#76b4f4'
						break;
						case 'PCB':
							tColor = '#b56d9c'
						break;
						case 'PCO':
							tColor = '#1aafca'
						break;
						case 'PRB':
							tColor = '#81e3ff'
						break;
						case 'PRTB':
							tColor = '#ebe77b'
						break;
						case 'PSB':
							tColor = '#debf51'
						break;
						case 'PSC':
							tColor = '#53ab45'
						break;
						case 'PSD':
							tColor = '#73e242'
						break;
						case 'PSDB':
							tColor = '#3780bf'
						break;
						case 'PSD':
							PSDC = '#904a34'
						break;
						case 'PSL':
							tColor = '#6f5ac9'
						break;
						case 'PSOL':
							PSDC = '#8e6a4f'
						break;
						case 'PSTU':
							tColor = '#de8351'
						break;
						case 'PV':
							PSDC = '#6e7c2f'
						break;
						default:
							tColor = '#7b8174'
						break;
					};
					$('#' + arrItensApuracao[i]._rodaPercent).val(conta).trigger('change')
					$('#' + arrItensApuracao[i]._rodaPercent).val(conta).trigger('configure',{
						'fgColor': tColor
					})
					if(data.candidates[i].eleito == "S"){
						eleito.style.display="block";
					}
				}else{
					apuracaoVotos.innerHTML = 'Votos ' + 0;
					percentualVotos.innerHTML = '0 %';
				}
			}
		}
	})
}