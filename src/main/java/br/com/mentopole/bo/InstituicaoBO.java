package br.com.mentopole.bo;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import br.com.mentopole.dao.InstituicaoDAO;
import br.com.mentopole.dao.ServicoApoioDAO;
import br.com.mentopole.dao.UsuarioDAO;
import br.com.mentopole.model.Instituicao;
import br.com.mentopole.model.Usuario;

@Service
public class InstituicaoBO {

    private static final int NOME_MAX = 150;
    private static final int TIPO_MAX = 80;
    private static final int TELEFONE_MAX = 20;
    private static final int EMAIL_MAX = 150;

    private static final Pattern EMAIL_REGEX =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern TELEFONE_REGEX = Pattern.compile("^[0-9()+\\-\\s]+$");

    private final InstituicaoDAO instituicaoDAO;
    private final UsuarioDAO usuarioDAO;
    private final ServicoApoioDAO servicoApoioDAO;

    public InstituicaoBO(InstituicaoDAO instituicaoDAO,
                         UsuarioDAO usuarioDAO,
                         ServicoApoioDAO servicoApoioDAO) {
        this.instituicaoDAO = instituicaoDAO;
        this.usuarioDAO = usuarioDAO;
        this.servicoApoioDAO = servicoApoioDAO;
    }

    public Instituicao inserir(Instituicao instituicao) {
        validar(instituicao);
        validarContato(instituicao.getTelefone(), instituicao.getEmail());
        validarUsuarioResponsavel(instituicao.getUsuario());
        return instituicaoDAO.inserir(instituicao);
    }

    public Instituicao alterar(Long id, Instituicao instituicao) {
        Instituicao atual = buscarPorId(id);

        validar(instituicao);
        validarContato(instituicao.getTelefone(), instituicao.getEmail());


        Long idUsuarioAtual = atual.getUsuario() == null ? null : atual.getUsuario().getIdUsuario();
        if (!Objects.equals(idUsuarioAtual, instituicao.getUsuario().getIdUsuario())) {
            validarUsuarioResponsavel(instituicao.getUsuario());
        }

        instituicao.setIdInstituicao(id);
        if (!instituicaoDAO.alterar(instituicao)) {
            throw new NoSuchElementException("Instituição não encontrada: " + id);
        }
        return instituicao;
    }

    public void excluir(Long id) {
        buscarPorId(id);
        verificarDependencias(id);

        if (!instituicaoDAO.excluir(id)) {
            throw new NoSuchElementException("Instituição não encontrada: " + id);
        }
    }

    public Instituicao buscarPorId(Long id) {
        return instituicaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Instituição não encontrada: " + id));
    }

    public List<Instituicao> listarTodos() {
        return instituicaoDAO.listarTodos();
    }


    private void validar(Instituicao instituicao) {
        if (instituicao == null) {
            throw new IllegalArgumentException("Dados da instituição não informados.");
        }
        if (instituicao.getNome() == null || instituicao.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome da instituição é obrigatório.");
        }
        if (instituicao.getNome().trim().length() > NOME_MAX) {
            throw new IllegalArgumentException("Nome deve ter no máximo " + NOME_MAX + " caracteres.");
        }
        if (instituicao.getTipoInstituicao() == null || instituicao.getTipoInstituicao().isBlank()) {
            throw new IllegalArgumentException("Tipo da instituição é obrigatório.");
        }
        if (instituicao.getTipoInstituicao().trim().length() > TIPO_MAX) {
            throw new IllegalArgumentException("Tipo da instituição deve ter no máximo " + TIPO_MAX + " caracteres.");
        }
        if (instituicao.getUsuario() == null || instituicao.getUsuario().getIdUsuario() == null) {
            throw new IllegalArgumentException("Usuário responsável é obrigatório.");
        }
        instituicao.setNome(instituicao.getNome().trim());
        instituicao.setTipoInstituicao(instituicao.getTipoInstituicao().trim());
    }

    /** Telefone e e-mail são opcionais; se informados, precisam ser válidos. */
    private void validarContato(String telefone, String email) {
        if (telefone != null && !telefone.isBlank()) {
            String t = telefone.trim();
            long digitos = t.chars().filter(Character::isDigit).count();
            if (t.length() > TELEFONE_MAX || !TELEFONE_REGEX.matcher(t).matches()
                    || digitos < 8 || digitos > 15) {
                throw new IllegalArgumentException("Telefone inválido.");
            }
        }
        if (email != null && !email.isBlank()) {
            String e = email.trim();
            if (e.length() > EMAIL_MAX || !EMAIL_REGEX.matcher(e).matches()) {
                throw new IllegalArgumentException("E-mail da instituição inválido.");
            }
        }
    }

    private void validarUsuarioResponsavel(Usuario usuario) {
        if (usuario == null || usuario.getIdUsuario() == null) {
            throw new IllegalArgumentException("Usuário responsável é obrigatório.");
        }
        Long idUsuario = usuario.getIdUsuario();

        if (usuarioDAO.buscarPorId(idUsuario).isEmpty()) {
            throw new IllegalArgumentException("Usuário responsável não encontrado: " + idUsuario);
        }
        if (instituicaoDAO.existePorUsuario(idUsuario)) {
            throw new DataIntegrityViolationException("Este usuário já é responsável por outra instituição.");
        }
    }

    /** Bloqueia exclusão se a instituição ainda possui serviços de apoio. */
    private void verificarDependencias(Long id) {
        if (servicoApoioDAO.existePorInstituicao(id)) {
            throw new DataIntegrityViolationException(
                    "Instituição possui serviços de apoio associados e não pode ser excluída.");
        }
    }
}
