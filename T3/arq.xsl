<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>
                    <title>TP3</title>
                    <link rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                        crossorigin="anonymous"/>
                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"/>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"/>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"/>
                </head>
                <body>
                    <div class="list-group">
                        <xsl:apply-templates select="ARQSITS" mode="indice"/>
                        <xsl:apply-templates select="ARQSITS"/>
                    </div>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>

    <!-- Index.html -->
    <xsl:template match="ARQSITS" mode="indice">
        <xsl:for-each select="ARQELEM">
            <a href="{generate-id()}.html"
                class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">
                        <xsl:value-of select="IDENTI/text()"/>
                    </h5>
                    <small class="text-muted">
                        <xsl:value-of select="DATA/text()"/>
                    </small>
                </div>
                <p class="mb-1">
                    <xsl:value-of select="LUGAR"/>, <xsl:value-of select="FREGUE"/>
                </p>
                <small class="text-muted">
                    <xsl:value-of select="CONCEL"/>
                </small>
            </a>
        </xsl:for-each>
    </xsl:template>

    <!-- Páginas geradas -->
    <xsl:template match="ARQSITS">
        <xsl:for-each select="ARQELEM">
            <xsl:result-document href="site/{generate-id()}.html">
                <html>
                    <head>
                        <title>TP3</title>
                        <link rel="stylesheet"
                            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                            crossorigin="anonymous"/>
                        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"/>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"/>
                        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"/>
                    </head>
                    <body>
                        <div class="jumbotron">
                            <h1 class="display-4">
                                <xsl:value-of select="IDENTI"/>
                            </h1>
                            <h6>
                                <xsl:value-of select="DESCRI/LIGA"/>
                                <xsl:if test="CRONO">
                                    ::<xsl:value-of select="CRONO"/>
                                </xsl:if>
                            </h6>
                            <xsl:if test="ACESSO">
                                <p class="lead">
                                    <xsl:value-of select="ACESSO"/>
                                </p>
                            </xsl:if>
                            <h6><i>Autor: <xsl:value-of select="AUTOR"/> </i></h6>
                            <p class="badge badge-secondary"><xsl:value-of select="DATA"/></p>
                            <hr class="my-4"/>
                            <p>
                                <b>Quadro: </b>
                                <xsl:value-of select="QUADRO"/>
                            </p>
                            <xsl:if test="TRAARQ">
                                <p>
                                    <b>Traarq: </b>
                                    <xsl:value-of select="TRAARQ"/>
                                </p>
                            </xsl:if>
                            <p>
                                <b>Desarq: </b>
                                <xsl:value-of select="DESARQ"/>
                            </p>
                            <xsl:if test="INTERP">
                                <p>
                                    <b>Interp: </b>
                                    <xsl:value-of select="INTERP"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="DEPOSI">
                                <p>
                                    <b>Deposi: </b>
                                    <xsl:value-of select="DEPOSI"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="INTERE">
                                <p>
                                    <b>Intere: </b>
                                    <xsl:value-of select="INTERE"/>
                                </p>
                            </xsl:if>
                            <p>
                                <b>Tipo: </b>
                                <xsl:value-of select="TIPO/@ASSUNTO"/>
                            </p>
                            <xsl:if test="IMAGEM">
                                <p>IMAGEM: <i>(NOTA: Img não existe)</i></p>
                                <img>
                                    <xsl:attribute name="src">
                                        <xsl:value-of select="IMAGEM/@NOME"/>
                                    </xsl:attribute>
                                </img>
                            </xsl:if>
                            <p class="lead">
                                <button class="btn btn-outline-info btn-lg btn-block" type="button" data-toggle="collapse"
                                    data-target="#collapseExample" aria-expanded="false"
                                    aria-controls="collapseExample"> Detalhes geográficos </button>
                                <xsl:if test="INTERE">
                                    <button type="button" class="btn btn-outline-info btn-lg btn-block" data-toggle="modal" data-target="#refsBiblio">
                                        Referências bibliográficas
                                    </button>
                                </xsl:if>
                                
                                <!-- Modal -->
                                <div class="modal fade" id="refsBiblio" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h3 class="modal-title" id="exampleModalLongTitle">Refs. Bibliográficas</h3>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">x</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <ol> <!-- Lista para a refs bibliográficas -->
                                                    <xsl:for-each select="BIBLIO">
                                                        <li>
                                                            <xsl:value-of select="."/>
                                                        </li>
                                                    </xsl:for-each>
                                                </ol>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </p>
                            <div class="collapse" id="collapseExample">
                                <table class="table table-striped"> <!-- Tabela para refs geográficas -->
                                    <thead>
                                        <tr>
                                            <th scope="col">LUGAR</th>
                                            <th scope="col">FREGUE</th>
                                            <th scope="col">CONCEL</th>
                                            <th scope="col">CODADM</th>
                                            <th scope="col">LATITU</th>
                                            <th scope="col">LONGIT</th>
                                            <th scope="col">ALTITU</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <xsl:value-of select="LUGAR"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="FREGUE"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="CONCEL"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="CODADM"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="LATITU"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="LONGIT"/>
                                            </td>
                                            <td>
                                                <xsl:value-of select="ALTITU"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <hr/>
                            <!-- Paginação -->
                            <center>
                                <div class="btn-group center" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-secondary"><a style="color: white; !important" href="#">Anterior</a></button>
                                    <button type="button" class="btn btn-secondary"><a style="color: white; !important" href="index.html">Voltar</a></button>
                                    <button type="button" class="btn btn-secondary"><a style="color: white; !important" href="#">Seguinte</a></button>
                                </div>
                            </center>
                            
                        </div>
                    </body>
                </html>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
