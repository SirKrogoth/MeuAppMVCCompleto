using DevIO.Business.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DevIO.Data.Context
{
    public class MeuDbContext : DbContext
    {
        public MeuDbContext(DbContextOptions options) : base(options){}

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Endereco> Enderecos { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*
             Este bloco irá bloquear caso venhamos a esquecer de colocar alguma atribuição a um varchar.
            Caso este não seja informado, o entity irá configurar como varchar(MAX). Esta configuração irá fazer nosso banco ficar mais 
            pesado, então podemos mudar esta configuração padrão do entity
             */
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                .SelectMany(e => e.GetProperties()
                .Where(p => p.ClrType == typeof(string))))
                property.Relational().ColumnType = "varchar(100)";

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(MeuDbContext).Assembly);

            //Este código faz com que bloqueemos a deleção dos produtos caso um fornecedor seja excluido da base. Sem isso, 
            //o sistema irá verificar todos os produtos que estao vinculados ao fornecedor, e irá exclui-los também
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys())) relationship.DeleteBehavior = DeleteBehavior.ClientSetNull;
 
            base.OnModelCreating(modelBuilder);
        }
    }
}
