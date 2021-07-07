from numpy import sin, cos
import numpy as np
import scipy.integrate as integrate
import sympy as sp

class TriplePendulum:
    def __init__(self, i_state=[0, 0, 0, 0, 0, 0], lengths=(1, 1, 1), masses=(1, 1, 1), origin=(0, 0)):
        self.masses = masses
        self.lengths = lengths
        self.origin = origin
        self.time_elapsed = 0
        self.state = np.asarray(i_state, dtype='float') * np.pi / 180
        self.angles = (self.state[0], self.state[2], self.state[4])  # a1, a2, a3
        self.omegas = (self.state[1], self.state[3], self.state[5])  # w1, w2, w3
        self.count = 0


    def get_position(self):
        (m1, m2, m3, l1, l2, l3, a1, a2, a3) = self.masses + self.lengths + self.angles

        x = np.cumsum([self.origin[0], l1 * sin(a1), l2 * sin(a2), l3 * sin(a3)])
        y = np.cumsum([self.origin[1], -l1 * cos(a1), -l2 * cos(a2), -l3 * cos(a3)])

        return x, y

    def calculate_energy(self):
        return 0


    def get_omega_prime(self, state, t):
        (m1, m2, m3, l1, l2, l3) = self.masses + self.lengths
        self.angles = (state[0], state[2], state[4])
        self.omegas = (state[1], state[3], state[5])
        (a1, a2, a3, w1, w2, w3) = self.angles + self.omegas
        g = 9.8

        # coefficients of row 1 (regarding omega 1 double prime)
        A1 = l1 * l1 * (m1 + m2 * m3)
        B1 = 2 * l1 * l2 * m3 * cos(a1 - a2)
        D1 = 2 * w2 * l1 * l2 * m3 * sin(a1 - a2) * (w1 - w2)
        C1 = l1 * l3 * m3 * cos(a1 - a3)
        E1 = w2 * l1 * l3 * m3 * sin(a1 - a2) * (w1 - w3)
        K1 = -2 * w1 * w2 * l1 * l2 * m3 * sin(a1 - a2) - w1 * w3 * l1 * l3 * m3 * sin(a1 - a3) + g * l1 * (
                    m1 + m2 + m3) * sin(a1) + D1 + E1

        # coefficients of row 2 (regarding omega 2 double prime)
        A2 = l2 * l2 * (m2 + m3)
        B2 = 2 * l1 * l2 * m3 * cos(a1 - a2)
        D2 = 2 * w1 * l1 * l2 * sin(a1 - a2) * (w1 - w2)
        C2 = l2 * l3 * m3 * cos(a2 - a3)
        E2 = w3 * l2 * l3 * m3 * sin(a2 - a3) * (w2 - w3)
        K2 = 2 * w1 * w2 * l1 * l2 * m3 * sin(a1 - a2) - w2 * w3 * l2 * l3 * m2 * sin(a2 - a3) + g * l2 * sin(a2) * (
                    m2 + m3) + D2 + E2

        # coefficients of row 3 (regarding omega 3 double prime)
        A3 = l3 * l3 * m3
        B3 = l1 * l3 * m3 * cos(a1 - a3)
        D3 = w1 * l1 * l3 * m3 * sin(a1 - a3) * (w1 - w3)
        C3 = l2 * l3 * m3 * cos(a2 - a3)
        E3 = w2 * l2 * l3 * m3 * sin(a2 - a3) * (w2 - w3)
        K3 = w1 * w3 * l1 * l3 * sin(a1 - a3) + w2 * w3 * l2 * l3 * m3 * sin(a2 - a3) + g * l3 * m3 * sin(a3) + D3 + E3

        solution_matrix = sp.Matrix([ [A1, B1, C1, K1], [A2, B2, C2, K2], [A3, B3, C3, K3] ])
        solution = solution_matrix.rref()[0]

        omega_prime = [w1, solution[0, 3], w2, solution[1, 3], w3, solution[2, 3]]

        if self.count < 2:
            print(solution_matrix)
            print(solution)
            self.count += 1

        return omega_prime

    def step(self, dt):
        self.state = integrate.odeint(self.get_omega_prime, self.state, [0, dt])[1]
        self.time_elapsed = self.time_elapsed + dt
