import { Link } from "react-router-dom"
import { IconUser } from "../../assets/Icons/IconUser"
import { ArrowRight } from "lucide-react"

export const ItemAsesor = ({ id, nombre, descripcion, imagen, titulo}) => (
    <Link to={`/asesorias/${id}`} className="bg-white rounded-2xl shadow-md w-full flex items-center justify-center gap-4 px-4 py-4
  hover:shadow-lg transition-all duration-300 hover:bg-gray-100
  ">
    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
      {imagen ? (
        <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
      ) : (
        <IconUser className="h-12 w-12 text-orus-primary mx-auto my-auto" />
      )}
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="flex items-center justify-between w-full mb-1">
        <h3 className="text-orus-primary font-semibold text-base capitalize">{titulo}</h3>
          <ArrowRight className="h-5 w-5 text-orus-primary" />
      </div>
      <p className="text-gray-500 text-sm leading-snug">{descripcion}</p>
    </div>
  </Link>
)