# Aplicação de Simulador Financeiro

## Descrição Geral:

A aplicação Simulador Financeiro foi projetada para oferecer uma solução abrangente para a simulação e gestão de produtos financeiros.

## Funcionalidades Principais:

### Área do Cliente:

- **Formulário Personalizado:** Permite ao cliente inserir dados como nome, e-mail, telefone, rendimento mensal, montante desejado, tipo de produto, prazo de pagamento, seguro, e contribuição inicial.
- **Resumo da Simulação:** Exibido somente se o cliente aceitar os termos e condições. Inclui análise detalhada e tabela resumo.
- **Envio da Simulação:** Utiliza as informações do cliente do primeiro formulário. Envia e-mail ao cliente com PDF da simulação e SMS de confirmação.

### Área Administrativa:

- **Gerenciamento de Produtos:** Criar, editar ou desativar produtos financeiros. Configurar regras específicas.
- **Parâmetros de Cálculo:** Atualizar taxas de juros anuais e mensais, ajustar spreads, configurar percentuais de ITI e DRT, gerenciar valores residuais e condições de seguro.
- **Controle de Usuários:** Criar e gerenciar contas administrativas. Atribuir permissões específicas por usuário.
- **Relatórios e Estatísticas:** Gerar relatórios detalhados das simulações realizadas. Exibir métricas.

## Tecnologias Recomendadas:

- **Frontend:** Next.js, ShadCN otimizado para dispositivos móveis com Tailwind CSS.
- **Banco de Dados:** JSON local, Redis para cache e plano de simulação.
- **Gerenciamento de Estado:** Context API ou Zustand.
- **Validação de Formulários:** React Hook Form com Zod.
- **Autenticação e Segurança:** JWT, ACL.
