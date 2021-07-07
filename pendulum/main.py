from doublependulum import *
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from time import time
from random import random, randint
from matplotlib.widgets import Button, Slider

dt = 1.0 / 30.0  # 30fps

fig = plt.figure()
ax = fig.add_subplot(111, aspect='equal', autoscale_on=False, xlim=(-2.2, 2.2), ylim=(-2.3, 2.3))
ax.grid()

txt1 = Slider(plt.axes([0.1, 0.9, 0.3, 0.03]), label='S', valmin=0, valmax=10, valinit=5, valfmt='%0.0f')

time_lbl = ax.text(0.01, 0.02, '', transform=ax.transAxes)
energy_lbl = ax.text(0.8, 0.85, '', transform=ax.transAxes)


def generate_pendulums(n):
    """
        Given an integer n, the function returns a list of n pendulums and a list of lines that display each pendulum.
        randint is used to alter the initial conditions of angle2 by ~ +-1 billionth of a degree (skew_state)
    """
    local_lines = []
    local_pendulums = []
    for i in range(n):
        coin = random()
        skew_state = randint(1, 100) / 1000000000
        if coin < 0.5:
            skew_state = -skew_state
        temp_line, = ax.plot([], [], 'o-', lw=2)
        initial_conditions = [180, 0, 180 + skew_state, 0]
        lengths = (1, 1)
        masses = (1, 1)
        temp_pendulum = DoublePendulum(i_state=initial_conditions, masses=masses, lengths=lengths, optimize=True)
        local_lines.append(temp_line)
        local_pendulums.append(temp_pendulum)
    return local_pendulums, local_lines


pendulums, lines = generate_pendulums(10)

def init():
    """
        Function used by funcanimation to initialize the simulation. If there is only 1 pendulum, its energies
        will be displayed along with the elapsed time
    """
    for line in lines:
        line.set_data([], [])
        time_lbl.set_text('')
        energy_lbl.set_text('')
        if len(lines) > 1:
            return tuple(lines) + (time_lbl,)
    return tuple(lines) + (energy_lbl, time_lbl)


def animate(i):
    """
        generates the visuals in the simulation for each frame. The energy information is only generated when
        there is only 1 pendulum
    """
    global pendulums, dt
    for p in pendulums:
        p.step(dt)

    if len(pendulums) == 1:
        T = pendulums[0].get_kinetic_energy()
        V = pendulums[0].get_potential_energy()
        r_KE = round(T / (T + V) * 100)
        r_PE = round(V / (T + V) * 100)
        E = round(T + V, 1)
        if E < 0:
            r_PE = -r_PE
            r_KE = -r_KE
        energy_lbl.set_text("KE: " + str(r_KE) + " %\nPE: " + str(r_PE) + " %\nE: " + str(E) + " J")

    time_lbl.set_text("Time Elapsed: " + str(round(pendulums[0].time_elapsed, 1)) + " s")

    for i in range(len(lines)):
        lines[i].set_data(tuple(pendulums[i].get_position()))

    if len(lines) > 1:
        return tuple(lines) + (time_lbl, )
    return tuple(lines) + (energy_lbl, time_lbl)


# interval of animation is calculated and the simulation is created
t0 = time()
animate(0)
t1 = time()
interval = 1000 * dt - (t1 - t0)

ani = animation.FuncAnimation(fig, animate, frames=300, interval=interval, blit=True, init_func=init)

plt.show()
