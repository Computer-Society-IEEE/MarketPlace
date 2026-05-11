import React, { useState } from "react";
import PerfilComprador from "./Perfil_comprador";
import EditarPerfil from "./Editar_perfil";
import PerfilVendedor from "./Perfil_vendedor";

export default function HomeScreen() {
  const [screen, setScreen] = useState("comprador");

  if (screen === "editar")
    return (
      <EditarPerfil
        onBack={() => setScreen("comprador")}
        onSave={() => setScreen("comprador")}
        onCancel={() => setScreen("comprador")}
      />
    );

  if (screen === "vendedor")
    return <PerfilVendedor onBack={() => setScreen("comprador")} />;

  return (
    <PerfilComprador
      onEdit={() => setScreen("editar")}
      onVendedor={() => setScreen("vendedor")}
    />
  );
}
