export async function addProduto(produto) {
    console.log(produto);
    await fetch("http://localhost:3000/produto/cadastrar",
    {
        method: 'POST',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( (response) => {
        console.log(response);
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function listProduto() {
    const response = await fetch("http://localhost:3000/produto/",
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    return response.json()
}

export async function updateProduto(id,produto) {
    await fetch(`http://localhost:3000/produto/alterar/${id}`,
    {
        method: 'PUT',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function deleteProduto(id) {
    await fetch(`http://localhost:3000/produto/deletar/${id}`,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

// Categoria

export async function addCategoria(produto) {
    console.log(produto);
    await fetch("http://localhost:3000/categoria/cadastrar",
    {
        method: 'POST',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( (response) => {
        console.log(response);
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function listCategoria() {
    const response = await fetch("http://localhost:3000/categoria/",
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    return response.json()
}

export async function updateCategoria(id,produto) {
    await fetch(`http://localhost:3000/categoria/alterar/${id}`,
    {
        method: 'PUT',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function deleteCategoria(id) {
    await fetch(`http://localhost:3000/categoria/deletar/${id}`,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

// cliente

export async function addCliente(produto) {
    console.log(produto);
    await fetch("http://localhost:3000/cliente/cadastrar",
    {
        method: 'POST',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( (response) => {
        console.log(response);
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function listCliente() {
    const response = await fetch("http://localhost:3000/cliente/",
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    return response.json()
}

export async function updateCliente(id,produto) {
    await fetch(`http://localhost:3000/cliente/alterar/${id}`,
    {
        method: 'PUT',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function deleteCliente(id) {
    await fetch(`http://localhost:3000/cliente/deletar/${id}`,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });

}

    // Venda

export async function addVenda(produto) {
    console.log(produto);
    await fetch("http://localhost:3000/venda/cadastrar",
    {
        method: 'POST',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then( (response) => {
        console.log(response);
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function listVenda() {
    const response = await fetch("http://localhost:3000/venda/",
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    return response.json()
}

export async function updateVenda(id,produto) {
    await fetch(`http://localhost:3000/venda/alterar/${id}`,
    {
        method: 'PUT',
        body: JSON.stringify(produto),
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });
}

export async function deleteVenda(id) {
    await fetch(`http://localhost:3000/venda/deletar/${id}`,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then( (response) => {
        console.log(response);
        return response;
    })
    .catch( (error) => {
        console.log(error);
    });


}



export default {
    addProduto,
    listProduto,
    updateProduto,
    deleteProduto,

    addCategoria,
    listCategoria,
    updateCategoria,
    deleteCategoria,

    addCliente,
    listCliente,
    updateCliente,
    deleteCliente,

    addVenda,
    listVenda,
    updateVenda,
    deleteVenda
}
