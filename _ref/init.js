
var presidenteEstados = "http://apuracao-eleicoes2014.r7.com/143/1?page=1&items=3"
var outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/3?page=1&items=3"


var IE = document.all?true:false
var listenerIEX, listenerIEY;
var cargo = "Presidente"

jQuery(function($){
    var r = Raphael('mapPresidente', 990, 480);
    
    attributes = {
            fill: '#cdcccc',
            stroke: '#FFFFFF',
            'stroke-width': 1.1,
            'stroke-linejoin': 'round'
        },
    arr = new Array();
    
    $.ajax({
        url:presidenteEstados,
        cache:true,
        dataType: 'jsonp', 
        jsonpCallback: 'eleicoes2014_tempo_real',
        success: function(data){
            var tooltip = document.getElementById('tooltip');
            var seta = document.getElementById('conteinerSeta');
            
            var arrPartidos = ["PT","PSDB","PSB","DEM","PCDOB","PCB","PCO","PDT","PEN","PHS","PMDB","PMN","PP","PPL","PPS","PR","PRB","PROS","PRP","PRTB","PSB","PSC","PSD","PSDB","PSDC","PSL", "PSOL","PSTU", "PTDOB","PTB","PTC","PTN","PV"]
            var arrAbas = [
                {_id:"abaPres",     _target:"presidente"},
                {_id:"abaGov",      _target:"outrosCandidatos"},
                {_id:"abaSen",      _target:"outrosCandidatos"},
                {_id:"abaDepFed",   _target:"outrosCandidatos"},
                {_id:"abaDepEst",   _target:"outrosCandidatos"}
            ]

            
            
            var n = 30;
            setInterval(function(){
                n--
                document.getElementById('tempoAtualizar').innerHTML = n + " segundos";
                if(n < 2){
                    document.getElementById('tempoAtualizar').innerHTML = n + " segundo";
                }
                if(n == 0){
                    location.reload();
                }
            },1000)



            for (var country in paths) {
                var obj = r.path(paths[country].path);
                obj.estado = country
                arr[obj.id] = country;
                obj.info = paths[country].info
                obj.attr(attributes);
                obj.mouseover(function(){
                    pintaEstados(this);
                    populaTooltip(this, data)
                })
                obj.mousemove(function(e){
                   mMove(e);
                })
                obj.mouseout(function(){
                    mOut(this);
                })
            }

            for(var i = 0, lim = arrAbas.length; i < lim; i++){
                var obj = document.getElementById(arrAbas[i]._id)
                obj._pos = i;
                obj.onclick = function(){
                    for(var j = 0, limJ = arrAbas.length; j < limJ; j++){
                        $("#" + arrAbas[j]._id).removeClass('selecionada');
                        $("#" + arrAbas[j]._id).addClass('deselecionada');
                        var obj = document.getElementById(arrAbas[j]._target);
                        document.getElementById(arrAbas[j]._target).style.display='none';
                    }
                    document.getElementById(arrAbas[this._pos]._target).style.display='block'
                    TweenLite.to("#" + arrAbas[this._pos]._target, .3, {css:{alpha:1}})

                    //Redefine quem o objeto ajax deve ler
                    switch(this.id){
                        case "abaGov":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/3?page=1&items=3"
                            cargo = "Governador";
                        break;
                        case "abaSen":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/5?page=1&items=3"
                            cargo = "Senador";
                        break;
                        case "abaDepFed":
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/6?page=1&items=3"
                            cargo = "Dep. Federal";
                        break;
                        case "abaDepEst":
                            cargo = "Dep. Estadual";
                            outrosEstados = "http://apuracao-eleicoes2014.r7.com/143/7?page=1&items=3"
                        break;
                    }
                    $.ajax({
                        url:outrosEstados,
                        cache:true,
                        dataType: 'jsonp', 
                        jsonpCallback: 'eleicoes2014_geral',
                        success:function(data){
                            var mapa = document.getElementById('mapPresidente')
                            mapa.removeChild(mapa.childNodes[0]);
                            r = Raphael('mapPresidente', 990, 480);
                            for (var country in paths) {
                                var obj = r.path(paths[country].path);
                                obj.estado = country
                                arr[obj.id] = country;
                                obj.info = paths[country].info
                                obj.attr(attributes);
                                obj.mouseover(function(){
                                    pintaEstados(this);
                                    populaTooltip(this, data)
                                });

                                obj.mousemove(function(e){
                                    mMove(e)
                                })
                                obj.mouseout(function(){
                                    mOut(this);
                                })
                            }
                        }
                    })
                    $(this).addClass('selecionada')
                    $(this).removeClass('deselecionada')
                }
            }

            function populaTooltip(target, objData){
                if(objData.locations[String(target.estado).toUpperCase()].partial == null){
                        tooltip.innerHTML = "Apurações ainda não começaram";
                    }else if(objData.locations[String(target.estado).toUpperCase()].partial.secoesTotalizadas == 0){
                        tooltip.innerHTML = "Apurações ainda não começaram";
                    }else{
                        var secTot = objData.locations[String(target.estado).toUpperCase()].partial.secoesTotalizadas;  
                        var secNTot = objData.locations[String(target.estado).toUpperCase()].partial.secoesNaoTotalizadas;
                        
                        secTot  = parseInt(secTot);
                        secNTot = parseInt(secNTot);


                        var contaSec = (secTot / (secTot + secNTot)) * 100;
                        var contaSec2 = contaSec;
                        contaSec = contaSec.toFixed(2).replace('.', ',');

                        tooltip.innerHTML = 
                        '<h1>' + target.info + '</h1>'
                        +'<div class="urnasApuradas">' + contaSec + '% URNAS APURADAS</div>'
                        
                        for(var i =0, lim = objData.locations[String(target.estado).toUpperCase()].candidates.length; i <lim; i++){
                            tooltip.innerHTML += 
                            '<div class="candidatoApuracao">'
                                +'<div class="bolinhaApuracaoEstadual ' + objData.locations[String(target.estado).toUpperCase()].candidates[i].partido +'" id="bolinhaApuracao' + (i+1) +  '">'
                                +   Math.round( ((objData.locations[String(target.estado).toUpperCase()].candidates[i].totalVotos/objData.locations[String(target.estado).toUpperCase()].partial.votosValidos)*100))
                                +'%</div>'
                                +'<div class="candidatoApuracaoEstadual">'
                                +        cargo + '<br>'
                                +         objData.locations[String(target.estado).toUpperCase()].candidates[i].nomeUrna+' <span>'+ objData.locations[String(target.estado).toUpperCase()].candidates[i].partido +'</span>'
                                +'</div>'
                                +'<div class="quantdadeVotosApuracaoEstadual">'
                                +   objData.locations[String(target.estado).toUpperCase()].candidates[i].totalVotos+'<br>'
                                +'    votos'
                                +'</div>'
                            +'</div>'
                            +'<div class="clear"></div>'
                        }
                    }
            }

            //Exibe o tooltip e faz ele acompanhar o mouse
            function mMove(e){
                if(IE){
                    listenerIEX = e.clientX;
                    listenerIEY = e.clientY;
                }else{
                    listenerIEX = e.pageX;
                    listenerIEY = e.pageY;
                }
                tooltip.style.display = "block";
                seta.style.display = "block";
                TweenLite.to("#tooltip", .3, {css:{alpha:1,left:listenerIEX+24, top:listenerIEY - 66 - tooltip.offsetHeight}})
                TweenLite.to("#conteinerSeta", .3, {css:{alpha:1,left:listenerIEX+5, top:listenerIEY - 80}})
            }

            //Colore os estados
            function pintaEstados(target){
                target.animate({
                    fill: '#c75252'
                }, 300);
                if(!IE){
                    //Seleciona os estados que devem trocar a cor do texto (ou não)
                    switch(arr[target.id]) {
                        case "rn":
                        case "ac":
                        case "df":
                        case "pb":
                        case "pe":
                        case "al":
                        case "se":
                        case "rj":
                        case "es":
                            document.getElementById(arr[target.id]).style.color = "#464646";
                        break;
                        default:
                            document.getElementById(arr[target.id]).style.color = "#FFF";
                        break;
                    }
                }
            }

            //Descolore os estados e esconde o tooltip
            function mOut(target){
                target.animate({
                    fill: attributes.fill
                }, 300);
                document.getElementById(arr[target.id]).style.color = "#464646";
                TweenLite.to("#tooltip", .3, {css:{alpha:0}, onComplete:function(){
                    tooltip.style.display='none'
                }})
                TweenLite.to("#conteinerSeta", .3, {css:{alpha:0}, onComplete:function(){
                    seta.style.display='none'
                }})
            }
        }
    })
});
//jQuery.expr[':'].raph=function(objNode,intStackIndex,arrProperties,arrNodeStack){var c=objNode.getAttribute('class');return(c&&c.indexOf(arrProperties[3])!=-1);}