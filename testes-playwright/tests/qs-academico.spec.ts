import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/02-TesteAutomatizado/');
  });

  // ========== GRUPO 1: Verificações Iniciais da Página ==========

  test.describe('Estrutura da Página', () => {

    test('deve exibir título correto da página', async ({ page }) => {
      await expect(page).toHaveTitle(/QS Acadêmico/);
    });

    test('deve exibir seção de cadastro', async ({ page }) => {
      await expect(page.locator('#secao-cadastro')).toBeVisible();
    });

    test('campo nome deve ter placeholder correto', async ({ page }) => {
      await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
        'placeholder',
        'Digite o nome completo'
      );
    });

    test('tabela deve iniciar vazia', async ({ page }) => {
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByText('João Silva')).toBeVisible();
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {

      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 3: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(4);

      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== GRUPO 4: Validação de Notas ==========

  test.describe('Validação de Notas', () => {

    test('não deve aceitar nota maior que 10', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Carlos');

      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

    test('não deve aceitar nota negativa', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Maria');

      await page.getByLabel('Nota 1').fill('-1');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 5: Busca de Alunos ==========

  test.describe('Busca de Alunos', () => {

    test('deve filtrar alunos pelo nome', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Maria Souza');
      await page.getByLabel('Nota 1').fill('4');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByPlaceholder('Buscar aluno').fill('Maria');

      await expect(page.getByText('Maria Souza')).toBeVisible();
      await expect(page.getByText('João Silva')).not.toBeVisible();
    });

  });

  // ========== GRUPO 6: Exclusão de Alunos ==========

  test.describe('Exclusão de Alunos', () => {

    test('deve excluir aluno cadastrado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Teste');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('8');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir' }).click();

      await expect(page.getByText('Aluno Teste')).not.toBeVisible();
    });

  });

  // ========== GRUPO 7: Situação do Aluno ==========

  test.describe('Situação do Aluno', () => {

    test('deve mostrar situação Aprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('9');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.getByText('Aprovado')).toBeVisible();
    });

    test('deve mostrar situação Reprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('2');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.getByText('Reprovado')).toBeVisible();
    });

    test('deve mostrar situação Recuperação', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('5');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.getByText('Recuperação')).toBeVisible();
    });

  });

  // ========== GRUPO 8: Múltiplos Cadastros ==========

  test.describe('Múltiplos Cadastros', () => {

    test('deve cadastrar três alunos consecutivos', async ({ page }) => {

      const alunos = [
        { nome: 'Aluno 1', n1: '4', n2: '8', n3: '10' },
        { nome: 'Aluno 2', n1: '7', n2: '6', n3: '9' },
        { nome: 'Aluno 3', n1: '5', n2: '8', n3: '6' }
      ];

      for (const aluno of alunos) {

        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.n1);
        await page.getByLabel('Nota 2').fill(aluno.n2);
        await page.getByLabel('Nota 3').fill(aluno.n3);

        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

  });

  // ========== GRUPO 9: Estatísticas ==========

  test.describe('Estatísticas', () => {

    test('deve atualizar os cards corretamente', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno A');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-total')).toHaveText('1');
    });

  });

  // ========== GRUPO 10: Limpar Tudo (dialog confirm) ==========

  test.describe('Limpar Tudo', () => {

    test('deve limpar alunos ao confirmar diálogo', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Aluno Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Limpar Tudo' }).click();

      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

});