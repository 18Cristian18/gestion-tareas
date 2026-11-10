import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '../components/TaskList.vue'

describe('TaskList', () => {
  it('muestra las tareas registradas', () => {
    const wrapper = mount(TaskList, {
      props: {
        tareas: [
          {
            id: 1,
            titulo: 'Aprender Vue',
            descripcion: 'Practicar componentes',
            estado: 'pendiente'
          }
        ],
        cargando: false
      }
    })

    expect(wrapper.text()).toContain('Aprender Vue')
    expect(wrapper.text()).toContain('Practicar componentes')
  })

  it('emite el evento editar al presionar el boton', async () => {
    const tarea = {
      id: 1,
      titulo: 'Aprender Vue',
      descripcion: 'Practicar componentes',
      estado: 'pendiente'
    }

    const wrapper = mount(TaskList, {
      props: {
        tareas: [tarea],
        cargando: false
      }
    })

    await wrapper.find('.editar').trigger('click')

    expect(wrapper.emitted('editar')[0][0]).toEqual(tarea)
  })

  it('emite el evento eliminar al presionar el boton', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tareas: [
          {
            id: 1,
            titulo: 'Aprender Vue',
            descripcion: 'Practicar componentes',
            estado: 'pendiente'
          }
        ],
        cargando: false
      }
    })

    await wrapper.find('.eliminar').trigger('click')

    expect(wrapper.emitted('eliminar')[0][0]).toBe(1)
  })
})
