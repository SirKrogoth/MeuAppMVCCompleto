using DevIO.Business.Models;
using FluentValidation;
using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Reflection.PortableExecutable;
using System.Runtime.CompilerServices;
using System.Text;

namespace DevIO.Business.Services
{
    public abstract class BaseService
    {
        protected void Notificar(ValidationResult validationResult)
        {
            foreach (var error in validationResult.Errors)
            {
                Notificar(error.ErrorMessage);
            }
        }

        protected void Notificar(string mensagem)
        {
            //propagar erro
        }

        protected bool ExecutarValidacao<TV, TE>(TV validacao, TE entidade) where TV : AbstractValidator<TE> where TE : Entity
        {
            var validator = validacao.Validate(entidade);

            if(validator.IsValid) return true;

            Notificar(validator);

            return false;
        }
    }
}
