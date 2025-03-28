import { Request, Response } from "express";
import { Sale } from "../models/Sale.model";
import { Purchase } from "../models/Purchase.model";
import { Service } from "../models/Service.model";
import { Movement } from "../models/Movement.model";
import { Catalog } from "../models/Catalog.model";

export const getDashboardData = async ( req: Request, res: Response ) => {

  try {

      // 1. Ingresos vs. Gastos
      const ganancias = await Sale.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalVentas: { $sum: "$total" } } }
      ])
  
      const gastos = await Purchase.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalCompras: { $sum: "$total" } } }
      ])
  
      // 2. Servicios Populares
      const serviciosPopulares = await Sale.aggregate([
        { $group: { _id: "$service", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
  
      // 3. Tipos de Vehículos Comunes
      const tiposVehiculos = await Service.aggregate([
        { $group: { _id: "$vehicleDetails.vehicleType", total: { $sum: 1 } } }, 
        { $sort: { total: -1 } }
      ])
  
      // 4. Clientes Nuevos
      const clientesNuevosPorMes = await Service.aggregate([
        // Extraer el mes y año de la fecha de la venta
        {
          $addFields: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          }
        },
        // Obtener el PRIMER mes y año en que cada cliente hizo una compra
        {
          $group: {
            _id: "$customerId",
            firstPurchaseYear: { $min: "$year" },
            firstPurchaseMonth: { $min: "$month" }
          }
        },
        // Contar cuántos clientes hicieron su primera compra en cada mes
        {
          $group: {
            _id: { year: "$firstPurchaseYear", month: "$firstPurchaseMonth" },
            nuevosClientes: { $sum: 1 }
          }
        },
        // Ordenar por año y mes
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);
  
      // 5. Productos Más Usados
      const productosUsados = await Movement.aggregate([
        { $group: { _id: "$productId", total: { $sum: "$quantityUsed" } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
  
      // 6. Métodos de Pago Más Usados
      const metodosPago = await Service.aggregate([
        { $group: { _id: "$paymentMethod", total: { $sum: 1 } } }
      ])
  
      // 7. Empleados Más Activos
      const empleadosActivos = await Catalog.aggregate([
        { $unwind: "$assignedStaff" },
        { $group: { _id: "$assignedStaff", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])

      //8. Top Clientes: 

      const topClientes = await Service.aggregate([
        // Agrupar por cliente y contar cuántos servicios ha adquirido
        {
          $group: {
            _id: "$customerId",
            totalServicios: { $sum: 1 }
          }
        },
        // Ordenar por la cantidad de servicios en orden descendente
        {
          $sort: { totalServicios: -1 }
        },
        // Limitar el resultado a los 3 clientes más recurrentes
        {
          $limit: 3
        },
        // Poblar los datos del cliente (opcional, si quieres mostrar más detalles)
        {
          $lookup: {
            from: "customers", // La colección donde están los clientes
            localField: "_id",
            foreignField: "_id",
            as: "cliente"
          }
        },
        // Desestructurar el array de cliente para obtener los datos directos
        {
          $unwind: "$cliente"
        },
        // Seleccionar los campos que quieres en la respuesta
        {
          $project: {
            _id: 0,
            clienteId: "$cliente._id",
            nombre: "$cliente.fullname",
            dni: "$cliente.dni",
            email: "$cliente.email",
            totalServicios: 1
          }
        }
      ]);
  
      // Devolver la respuesta con todos los datos
      res.json({
          ganancias,
          gastos,
          serviciosPopulares,
          tiposVehiculos,
          clientesNuevosPorMes,
          productosUsados,
          metodosPago,
          empleadosActivos,
          topClientes
      })

  } catch (error) {
      res.status(500).json({ error: 'Error al obtener los datos del dashboard' })
  }
}