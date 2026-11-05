import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import pug from 'pug';

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// REMEDIACION DE VULNERABILIDAD: SSTI (Server-Side Template Injection)
// Se compila una plantilla estatica y segura sin concatenar entradas de usuario sin sanitizar.
// Los datos del usuario se pasan de forma segura como objeto de datos (locals) a la funcion compilada,
// garantizando el escape automatico de caracteres y evitando ejecucion arbitraria de codigo.

const secureTemplate = `
doctype html
html
  head
    title Hello world
  body
    form(action='/' method='post')
      input#username.form-control(type='text' name='username' value=username)
      button.btn.btn-primary(type='submit') Submit
    p Hello #{username}`;

const compiledTemplate = pug.compile(secureTemplate);

app.post('/', (req: Request, res: Response) => {
  const username = typeof req.body?.username === 'string' ? req.body.username : '';
  const html = compiledTemplate({ username });
  res.send(html);
});

export function startServer(port: number = 3000) {
  return app.listen(port, () => {
    console.log(`Server is running securely on port ${port}`);
  });
}
