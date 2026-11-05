// Principio de Consistencia y Tipado Seguro
export const valorBase: number = 10;
export const resultadoFinal: number = valorBase * 2;

// Principio de Adaptabilidad: Correccion del tipo de dato (string en vez de asignar number)
export const message: string = valorBase.toString();

// Principio de Responsabilidad Unica (SRP - SOLID):
// Una clase debe tener una unica razon para cambiar.
// Se separa la gestion de usuarios del servicio de envio de correos electronicos.

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  public getUserData(userId: string): UserData {
    return {
      id: userId,
      name: 'Usuario Demo',
      email: 'usuario@duocuc.cl',
    };
  }
}

export class EmailNotificationService {
  public sendEmail(to: string, subject: string, body: string): boolean {
    // Logica controlada para el envio seguro de correos
    console.log(`Correo enviado a: ${to} con asunto: ${subject}`);
    return true;
  }
}
