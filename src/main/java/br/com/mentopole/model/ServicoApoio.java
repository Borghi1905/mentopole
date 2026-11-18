package br.com.mentopole.model;

import java.util.Objects;

public class ServicoApoio {

    private Long idServico;
    private String nome;
    private String modalidade;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private String telefone;
    private String horarioFuncionamento;
    private String linkAtendimento;
    private Instituicao instituicao;
    private CategoriaServico categoriaServico;
    private Regiao regiao;

    public ServicoApoio() {
    }

    public ServicoApoio(Long idServico, String nome, String modalidade, String endereco, Double latitude, Double longitude, String telefone, String horarioFuncionamento, String linkAtendimento, Instituicao instituicao, CategoriaServico categoriaServico, Regiao regiao) {
        this.idServico = idServico;
        this.nome = nome;
        this.modalidade = modalidade;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
        this.telefone = telefone;
        this.horarioFuncionamento = horarioFuncionamento;
        this.linkAtendimento = linkAtendimento;
        this.instituicao = instituicao;
        this.categoriaServico = categoriaServico;
        this.regiao = regiao;
    }

    public Long getIdServico() {
        return idServico;
    }

    public void setIdServico(Long idServico) {
        this.idServico = idServico;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getHorarioFuncionamento() {
        return horarioFuncionamento;
    }

    public void setHorarioFuncionamento(String horarioFuncionamento) {
        this.horarioFuncionamento = horarioFuncionamento;
    }

    public String getLinkAtendimento() {
        return linkAtendimento;
    }

    public void setLinkAtendimento(String linkAtendimento) {
        this.linkAtendimento = linkAtendimento;
    }

    public Instituicao getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(Instituicao instituicao) {
        this.instituicao = instituicao;
    }

    public CategoriaServico getCategoriaServico() {
        return categoriaServico;
    }

    public void setCategoriaServico(CategoriaServico categoriaServico) {
        this.categoriaServico = categoriaServico;
    }

    public Regiao getRegiao() {
        return regiao;
    }

    public void setRegiao(Regiao regiao) {
        this.regiao = regiao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ServicoApoio other = (ServicoApoio) o;
        return idServico != null && Objects.equals(idServico, other.idServico);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idServico);
    }

    @Override
    public String toString() {
        return "ServicoApoio{" +
                "idServico=" + idServico + ", " +
                "nome=" + nome + ", " +
                "modalidade=" + modalidade + ", " +
                "endereco=" + endereco + ", " +
                "latitude=" + latitude + ", " +
                "longitude=" + longitude + ", " +
                "telefone=" + telefone + ", " +
                "horarioFuncionamento=" + horarioFuncionamento + ", " +
                "linkAtendimento=" + linkAtendimento + ", " +
                "instituicao=" + (instituicao == null ? null : instituicao.getIdInstituicao()) + ", " +
                "categoriaServico=" + (categoriaServico == null ? null : categoriaServico.getIdTipoServico()) + ", " +
                "regiao=" + (regiao == null ? null : regiao.getIdRegiao()) + "}";
    }
}
